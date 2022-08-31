%%raw(`require('graphql-import-node/register')`)

open GraphEntityGenTemplates

@module("path") external dirname: string => string = "dirname"
@module("path") external resolve: (string,string) => string = "resolve"

@val external requireGqlFile: string => 'a = "require"

let sourceDir = dirname(CodegenConfig.graphManifest)
Js.log(sourceDir)

Js.log(CodegenConfig.codegenConfigPath)
let repoConfigString = Node_fs.readFileAsUtf8Sync(CodegenConfig.codegenConfigPath)

let manifestString = Node_fs.readFileAsUtf8Sync(CodegenConfig.graphManifest)

let manifest = Utils.loadYaml(manifestString)

let schemaPath = manifest["schema"]["file"]
Js.log(schemaPath)

let absolutePathSchema = resolve(sourceDir, schemaPath)

let loadedGraphSchema = requireGqlFile(absolutePathSchema)
 

let repoConfig = Utils.loadYaml(repoConfigString)

let entityDefinitions = loadedGraphSchema["definitions"]

type enumItem
let enumsMap: Js.Dict.t<enumItem> = Js.Dict.empty()
type interfaceItem
let interfacesMap: Js.Dict.t<interfaceItem> = Js.Dict.empty()
type entityItem
let entitiesMap: Js.Dict.t<entityItem> = Js.Dict.empty()

entityDefinitions->Array.forEach(entity => {
  let name = entity["name"]["value"]

  let entityKind = entity["kind"]

  let _ = switch entityKind {
  | #EnumTypeDefinition => enumsMap->Js.Dict.set(name, entity->Obj.magic)
  | #InterfaceTypeDefinition => interfacesMap->Js.Dict.set(name, entity->Obj.magic)
  | #ObjectTypeDefinition => entitiesMap->Js.Dict.set(name, entity->Obj.magic)
  }
})

let getNamedType = (~entityAsIdString, name) => {
  switch name["value"] {
  | #String => "string"
  | #Int => "i32"
  | #BigInt => "BigInt"
  | #Bytes => "Bytes"
  | #Boolean => "boolean"
  | uncaught =>
    let nonStandardTypeString = uncaught->Obj.magic

    if entitiesMap->Js.Dict.get(nonStandardTypeString)->Option.isSome {
      if entityAsIdString {
        "string"
      } else {
        nonStandardTypeString
      }
    } else if enumsMap->Js.Dict.get(nonStandardTypeString)->Option.isSome {
      "string"
    } else {
      Js.log(unhandledTypeMessage(~uncaught))
      "UNHANDLED_TYPE"
    }
  }
}

let rec getFieldType = (~entityAsIdString=false, field) =>
  switch field["kind"] {
  | #NamedType => field["name"]->getNamedType(~entityAsIdString)
  | #ListType =>
    let innerType = field["type"]->getFieldType(~entityAsIdString)
    `Array<${innerType}>`
  | #NonNullType =>
    let innerType = field["type"]->getFieldType(~entityAsIdString)
    innerType
  | uncaught =>
    Js.log(uncaught)
    "unknown"
  }

type fieldType = NormalValue | Entity | EntityArray

let rec getFieldSetterType = field =>
  switch field["kind"] {
  | #NamedType =>
    if entitiesMap->Js.Dict.get(field["name"]["value"])->Option.isSome {
      Entity
    } else {
      NormalValue
    }
  | #ListType => field["type"]->getFieldSetterType == Entity ? EntityArray : NormalValue
  | #NonNullType => field["type"]->getFieldSetterType
  | uncaught =>
    Js.log2("Uncaught entity type", uncaught)
    NormalValue
  }

let getFieldValueToSave = (nameOfObject, field) => {
  switch field["type"]->getFieldSetterType {
  | NormalValue => `${nameOfObject}.${field["name"]["value"]}`
  | EntityArray => `entityArrayToIdArray(${nameOfObject}.${field["name"]["value"]})`
  | Entity => `${nameOfObject}.${field["name"]["value"]}.id`
  }
}

let getDefaultValueForType = (~strictMode, ~recersivelyCreateUncreatedEntities, typeName) => {
  entitiesMap
  ->Js.Dict.get(typeName)
  ->Option.mapWithDefault(
    enumsMap
    ->Js.Dict.get(typeName)
    ->Option.mapWithDefault(typeName->getDefaultValues, enum => {
      `"${((enum->Obj.magic)["values"]->Array.getUnsafe(0))["name"]["value"]}"`
    }),
    _entityType =>
      recersivelyCreateUncreatedEntities
        ? `"UNINITIALISED - ${typeName}"`
        : `getOrInitialize${typeName}Default("UNINITIALISED - ${typeName}", ${strictMode
              ? "true"
              : "false"}).id`,
  )
}

type entityIdPrefix = {networks: array<string>, prefix: string}
let entityPrefixConfig: array<entityIdPrefix> =
  repoConfig["networkConfig"]["entityIdPrefixes"]->Option.getWithDefault([])

let entityPrefixDefinition = {
  if entityPrefixConfig->Array.length > 1 {
    `  if ` ++
    entityPrefixConfig
    ->Array.map(({networks, prefix}) =>
      `(${networks
        ->Array.map(network => `network == "${network}"`)
        ->Array.joinWith(" || ", a => a)}) {
  return "${prefix}";
}`
    )
    ->Array.joinWith(" else if ", a => a) ++ ` else {
    return "";
  }`
  } else {
    `  return "";`
  }
}

let rec getFieldDefaultTypeNonNull = (~strictMode, ~recersivelyCreateUncreatedEntities, field) =>
  switch field["kind"] {
  | #ListType => "[]"
  | #NonNullType =>
    // This case sholud be impossible...
    field["type"]->getFieldDefaultTypeNonNull(~strictMode, ~recersivelyCreateUncreatedEntities)
  | #NamedType =>
    field["name"]["value"]->getDefaultValueForType(~strictMode, ~recersivelyCreateUncreatedEntities)
  | uncaught =>
    Js.log(uncaught)
    "unknown"
  }
let getFieldDefaultTypeWithNull = (
  ~strictMode=true,
  ~recersivelyCreateUncreatedEntities=false,
  field,
) =>
  switch field["kind"] {
  | #NonNullType =>
    field["type"]->getFieldDefaultTypeNonNull(~strictMode, ~recersivelyCreateUncreatedEntities)
  | #ListType
  | #NamedType => "null"
  | uncaught =>
    Js.log(uncaught)
    "unknown"
  }

let functions =
  entitiesMap
  ->Js.Dict.keys
  ->Array.map(entityName => {
    let entity = entitiesMap->Js.Dict.unsafeGet(entityName)->Obj.magic
    let name = entity["name"]["value"]

    let fields = entity["fields"]
    let fieldsMap = Js.Dict.empty()
    let _ = fields->Array.map(field => {
      let fieldName = field["name"]["value"]
      fieldsMap->Js.Dict.set(fieldName, field)
    })
    let entityConfig =
      repoConfig["entitySettings"]
      ->Js.Dict.get(name)
      ->Option.getWithDefault({"useDefault": Js.Dict.empty(), "entityId": None, "setters": None})

    let fieldDefaultSettersStrict =
      fields
      ->Array.map(field => {
        let fieldName = field["name"]["value"]

        fieldName == "id"
          ? ""
          : setInitializeFieldValue(
              ~name,
              ~fieldName,
              ~fieldValue=field["type"]->getFieldDefaultTypeWithNull(
                ~recersivelyCreateUncreatedEntities=true,
              ),
            )
      })
      ->Array.joinWith("\n  ", a => a)

    let fieldsWithDefaultValueLookup = entityConfig["useDefault"]

    let fieldInitialValueSettersStrict =
      fields
      ->Array.map(field => {
        let fieldName = field["name"]["value"]

        if fieldName == "id" {
          loadNewEntityId(~name)
        } else {
          fieldsWithDefaultValueLookup
          ->Js.Dict.get(fieldName)
          ->Option.mapWithDefault(
            {
              let fieldNameOrEntityIds = getFieldValueToSave("initialValues", field)

              setInitializeFieldValue(~name, ~fieldName, ~fieldValue=fieldNameOrEntityIds)
            },
            _fieldDefaultConfig =>
              setInitializeFieldValue(
                ~name,
                ~fieldName,
                ~fieldValue=field["type"]->getFieldDefaultTypeWithNull(~strictMode=false),
              ),
          )
        }
      })
      ->Array.joinWith("\n", a => a)

    let fieldToFieldTyping = field => {
      let fieldName = field["name"]["value"]
      if fieldName == "id" {
        ""
      } else {
        fieldsWithDefaultValueLookup
        ->Js.Dict.get(fieldName)
        ->Option.mapWithDefault(
          setFieldNameToFieldType(~fieldName, ~fieldType=field["type"]->getFieldType),
          _ => "",
        )
      }
    }
    let fieldInitialValues = fields->Array.map(fieldToFieldTyping)->Array.joinWith("", a => a)

    let idGeneratorFunction =
      entityConfig["entityId"]
      ->Option.map(idArgs => {
        let argsDefinition =
          idArgs
          ->Array.keep(arg => arg["type"] != "constant")
          ->Array.joinWith(",", arg => `${arg["name"]}: ${arg["type"]}`)
        // no string interpolation in assemblyscript :(
        let idString = idArgs->Array.joinWith(` + "-" + `, arg =>
          if arg["type"] != "constant" {
            toStringConverter(arg["name"], arg["type"])
          } else {
            `"${arg["value"]}"`
          }
        )

        generateId(~name, ~argsDefinition, ~idString)
      })
      ->Option.getWithDefault("")

    let fieldSetterFunctions =
      entityConfig["setters"]
      ->Option.map(setterFunctions => {
        let functions =
          setterFunctions
          ->Array.map(setter => {
            let functionName = setter["name"]
            let functionSetterFields = setter["fields"]
            let fieldTypeDef =
              functionSetterFields
              ->Array.map(field => {
                let result =
                  fieldsMap
                  ->Js.Dict.get(field)
                  ->Option.mapWithDefault(
                    fieldNotFoundForEntity(~field, ~functionName, ~name),
                    fieldDefinition =>
                      setField(
                        ~field,
                        ~fieldValue=fieldDefinition["type"]->getFieldType(~entityAsIdString=true),
                      ),
                  )

                result
              })
              ->Array.joinWith("", a => a)
            let fieldTypeSetters =
              functionSetterFields
              ->Array.map(field => {
                let result =
                  fieldsMap
                  ->Js.Dict.get(field)
                  ->Option.mapWithDefault(fieldNotFoundForEntity(~field, ~functionName, ~name), _ =>
                    setFieldToNewValue(~field)
                  )

                result
              })
              ->Array.joinWith("", a => a)

            createSetterFunction(~functionName, ~fieldTypeDef, ~name, ~fieldTypeSetters)
          })
          ->Array.joinWith("\n", arg => arg)
        functions
      })
      ->Option.getWithDefault("")
    entityGeneratedCode(
      ~idGeneratorFunction,
      ~name,
      ~fieldDefaultSettersStrict,
      ~fieldInitialValues,
      ~fieldInitialValueSettersStrict,
      ~fieldSetterFunctions,
    )
  })
  ->Array.joinWith("\n", a => a)

let entityImports =
  entityDefinitions
  ->Array.keep(entity => {
    entity["kind"] != #EnumTypeDefinition && entity["kind"] != #InterfaceTypeDefinition
  })
  ->Array.map(entity => `  ${entity["name"]["value"]}`)
  ->Array.joinWith(",\n", a => a)

let dir = `${CodegenConfig.outputEntityFilePath}`;


@module("fs")
external mkdirSync: (
  ~dir: string,
) => unit = "mkdirSync"


if (!Node_fs.existsSync(dir)){
    mkdirSync(~dir);
}


Node_fs.writeFileAsUtf8Sync(
  `${CodegenConfig.outputEntityFilePath}EntityHelpers.ts`,
  outputCode(~entityImports, ~networkIdPrefix=entityPrefixDefinition, ~functions),
)
