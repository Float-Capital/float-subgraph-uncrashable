%%raw(`require('graphql-import-node/register')`)
@val external requireGqlFile: string => 'a = "require"
let errors: Js.Array2.t<string> = []

type enumItem
let enumsMap: Js.Dict.t<enumItem> = Js.Dict.empty()
type interfaceItem
let interfacesMap: Js.Dict.t<interfaceItem> = Js.Dict.empty()
type entityItem
let entitiesMap: Js.Dict.t<entityItem> = Js.Dict.empty()
type configEntityItem
let configEntityMap: Js.Dict.t<configEntityItem> = Js.Dict.empty()

let getNamedType = name => {
  switch name["value"] {
  | #String => "string"
  | #Int => "i32"
  | #BigInt => "BigInt"
  | #Bytes => "Bytes"
  | #Boolean => "boolean"
  | #BigDecimal => "BigDecimal"
  | uncaught =>
    let nonStandardTypeString = uncaught->Obj.magic

    if configEntityMap->Js.Dict.get(nonStandardTypeString)->Option.isSome {
      nonStandardTypeString
    } else {
      let _ = errors->Js.Array2.push(`Unexpected entity param: in uncrashable-config.yaml`)
      "Unhandled"
    }
  }
}

let rec validateFieldType = (~config,field) =>
  switch field["type"]["kind"] {
  | #NamedType => 
      {
      ()}
      | #ListType => ()
      | #NonNullType => if config->Js.Dict.get(field["name"]["value"])->Option.isSome {
         ()
        } else {
          let _ = errors->Js.Array2.push(`Missing field: ${field["name"]["value"]} in uncrashable-config.yaml`)
        }
      | uncaught => Js.log(uncaught)
  }

let validateValue = (~config, ~rootName) => {
  // let configEntityMap

  if configEntityMap->Js.Dict.get(rootName)->Option.isSome {
    let entity = configEntityMap->Js.Dict.unsafeGet(rootName)->Obj.magic
    let kind = entity["kind"]
    let fields = entity["fields"]

    let fieldsMap = Js.Dict.empty()
    let _ = fields->Array.map(field => {
      let fieldName = field["name"]["value"]
      fieldsMap->Js.Dict.set(fieldName, field)
      let _ = field->validateFieldType(~config)
    })
    let _ =
      config
      ->Js.Dict.keys
      ->Array.map(entityName => {
        if fieldsMap->Js.Dict.get(entityName)->Option.isSome {
          let field = fieldsMap->Js.Dict.unsafeGet(entityName)->Obj.magic
        } else {
          let _ =
            errors->Js.Array2.push(`Unexpected field: ${entityName} in uncrashable-config.yaml`)
        }
      })
  }
}

let validateSchema = (~config) =>
{
     
let entitySettings = config->Js.Dict.get("entitySettings")->Option.getWithDefault(Js.Dict.empty())
      // config->Js.Dict.get("entitySettings")
     let _= entitySettings->Js.Dict.keys->Array.map(entityName => {
        if entitiesMap->Js.Dict.get(entityName)->Option.isSome {
          let entity = entitiesMap->Js.Dict.unsafeGet(entityName)->Obj.magic
        } else {
          let _ =
            errors->Js.Array2.push(`Unexpected entity: ${entityName} in uncrashable-config.yaml`)
        }
      })

    let _ = entitiesMap
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
      let _ =
      entitySettings->Js.Dict.get(name)
      ->Option.map(configEntity => {
        let _ = configEntity->Js.Dict.get("setters")
      ->Option.map(setterFunctions  =>{
        let functions =
          setterFunctions
          ->Array.map(setter => {
            let functionName = setter["name"]
            let functionSetterFields = setter["fields"]
            let fieldTypeDef =
              functionSetterFields
              ->Array.map(field => {
                if
                  fieldsMap
                  ->Js.Dict.get(field)
                  ->Option.isSome
                  {()}
                  else {
                    let _ =errors->Js.Array2.push(`Unexpected field ${field} in setter: ${functionName}, entity: ${entityName}`)
                  }
              })
          })
      })->Option.getWithDefault(())
    })
    
  })
}

let validate = (~entityDefinitions, ~uncrashableConfig) => {
  let file = "./uncrashable.graphql"

  let uncrashableConfigTemplate = requireGqlFile(file)

  let configTemplateDefinitions = uncrashableConfigTemplate["definitions"]

  entityDefinitions->Array.forEach(entity => {
    let name = entity["name"]["value"]

    let entityKind = entity["kind"]

    let _ = switch entityKind {
    | #EnumTypeDefinition => enumsMap->Js.Dict.set(name, entity->Obj.magic)
    | #InterfaceTypeDefinition => interfacesMap->Js.Dict.set(name, entity->Obj.magic)
    | #ObjectTypeDefinition => entitiesMap->Js.Dict.set(name, entity->Obj.magic)
    }
  })

  configTemplateDefinitions->Array.forEach(entity => {
    let name = entity["name"]["value"]

    let entityKind = entity["kind"]

    let _ = switch entityKind {
    | #EnumTypeDefinition => enumsMap->Js.Dict.set(name, entity->Obj.magic)
    | #InterfaceTypeDefinition => interfacesMap->Js.Dict.set(name, entity->Obj.magic)
    | #ObjectTypeDefinition => configEntityMap->Js.Dict.set(name, entity->Obj.magic)
    }
  })

  let _ = validateValue(~config=uncrashableConfig, ~rootName="UncrashableConfig")
  let _ = validateSchema(~config=uncrashableConfig)

  errors
}
