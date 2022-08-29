// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var CodegenConfig = require("./CodegenConfig.bs.js");

function loadNewEntityId(name) {
  return "  let loaded" + name + " = new " + name + "(entityId);\n";
}

function setInitializeFieldValue(name, fieldName, fieldValue) {
  return "  loaded" + name + "." + fieldName + " = " + fieldValue + ";";
}

function setField(field, fieldValue) {
  return "  " + field + ": " + fieldValue + ";\n";
}

function setFieldToNewValue(field) {
  return "  entity." + field + " = newValues." + field + ";\n";
}

function setFieldNameToFieldType(fieldName, fieldType) {
  return "  " + fieldName + ": " + fieldType + ";\n";
}

function getDefaultValues(typeString) {
  switch (typeString) {
    case "Address" :
        return "Address.fromString(\"0x0000000000000000000000000000000000000000\")";
    case "BigInt" :
        return "BigInt.fromI32(0)";
    case "Boolean" :
        return "false";
    case "Bytes" :
        return "Bytes.fromHexString(\"0x00\") as Bytes";
    case "Int" :
        return "0";
    case "String" :
        return "\"\"";
    default:
      return "\"" + typeString + " - Unknown type\"";
  }
}

function toStringConverter(paramName, paramType) {
  switch (paramType) {
    case "BigInt" :
        return paramName + ".toString()";
    case "Address" :
    case "Bytes" :
        return paramName + ".toHex()";
    case "String" :
        return paramName;
    default:
      return "\"unhandled type in converter " + paramType + " - Please fix the converter\"";
  }
}

function unhandledTypeMessage(uncaught) {
  return "unhandled type " + uncaught + " - please write a mapper for it";
}

function fieldNotFoundForEntity(field, functionName, name) {
  return "Cannot use field '" + field + "' in the '" + functionName + "' as it does not belong to the '" + name + "' entity.";
}

function generateId(name, argsDefinition, idString) {
  return "export function generate" + name + "Id(\n  " + argsDefinition + "\n): string {\n  return ENTITY_ID_PREFIX + " + idString + "\n}\n";
}

function createSetterFunction(functionName, fieldTypeDef, name, fieldTypeSetters) {
  return "export class " + functionName + "Values {\n" + fieldTypeDef + "}\n" + ("\nexport function " + functionName + "(entityId: string, newValues: " + functionName + "Values): void {\n  let entity = get" + name + "(entityId);\n" + fieldTypeSetters + "\n  entity.save();\n}\n");
}

function outputCode(entityImports, networkIdPrefix, functions) {
  return "import {\n" + entityImports + "\n} from \"../../" + CodegenConfig.genaretdFolderName + "/schema\";\nimport {\n  Address,\n  BigInt,\n  Bytes,\n  Entity,\n  dataSource\n} from \"@graphprotocol/graph-ts\";\nimport { logError } from \"../utils/helperFunctions\";\nimport { SAFE_MODE } from \"../config\";\n\nexport let NETWORK_NAME = dataSource.network(); // e.g. \"mainnet\", \"matic\", \"avalanche\", \"ropsten\", \"poa-core\"\n\nfunction getIdPrefix(network: string): string {\n" + networkIdPrefix + "\n}\nexport let ENTITY_ID_PREFIX = getIdPrefix(NETWORK_NAME);\n\nfunction makeSureEntityIdHasCorrectPrefix(entityId: string): string {\n  if (entityId.startsWith(ENTITY_ID_PREFIX)) {\n    return entityId;\n  } else {\n    return ENTITY_ID_PREFIX + entityId;\n  }\n}\n\nexport function entityArrayToIdArray(\n  entityArray: Array<Entity>\n): Array<string> {\n  // NOTE: this function is broken. The assembly script type system doesn't allow this.\n  //       use the default empty array ALWAYS untill we work this out.\n  // TODO: fix this function.\n  return entityArray.map((entity) => entity.getString(\"id\"));\n}\n\nexport class GetOrCreateReturn<EntityType> {\n  entity: EntityType;\n  wasCreated: boolean;\n\n  constructor(entity: EntityType, wasCreated: boolean) {\n    this.entity = entity;\n    this.wasCreated = wasCreated;\n  }\n}\n" + functions + "\n";
}

function getOrInitializeDefaultFunction(name, fieldDefaultSettersStrict) {
  return "\nfunction getOrInitialize" + name + "Default(entityId: string = \"UNINITIALISED - " + name + "\"): " + name + " {\n  entityId = makeSureEntityIdHasCorrectPrefix(entityId);\n  let loaded" + name + " = " + name + ".load(entityId);\n\n  if (loaded" + name + " == null) {\n    loaded" + name + " = new " + name + "(entityId);\n    " + fieldDefaultSettersStrict + "\n    loaded" + name + ".save();\n\n    return loaded" + name + ";\n  } else{\n    return loaded" + name + ";\n  }\n}\n";
}

function entityInitialValues(name, fieldInitialValues) {
  return "export class " + name + "InitialValues {\n" + fieldInitialValues + "}\n";
}

function createEntityFunction(name, fieldInitialValueSettersStrict) {
  return "\nexport function create" + name + "(entityId: string, initialValues: " + name + "InitialValues): " + name + " {\n  entityId = makeSureEntityIdHasCorrectPrefix(entityId);\n  if (SAFE_MODE && " + name + ".load(entityId) != null) {\n    logError(\"THIS CODE IS BUGGY! Trying to create an entity that already exists. (entityType : " + name + ", entitiyID: {})\", [entityId]);\n\n    return " + name + ".load(entityId) as " + name + ";\n  }\n" + fieldInitialValueSettersStrict + "\n\n  loaded" + name + ".save();\n\n  return loaded" + name + ";\n}\n";
}

function doesEntityExistFunction(name) {
  return "\nexport function does" + name + "Exist(entityId: string): boolean {\n  entityId = makeSureEntityIdHasCorrectPrefix(entityId);\n  return " + name + ".load(entityId) != null;\n}\n";
}

function getOrInitializeFunction(name) {
  return "\nexport function getOrInitialize" + name + "(entityId: string, initialValues: " + name + "InitialValues): GetOrCreateReturn<" + name + "> {\n  entityId = makeSureEntityIdHasCorrectPrefix(entityId);\n  let loaded" + name + " = " + name + ".load(entityId);\n\n  let returnObject: GetOrCreateReturn<" + name + ">;\n\n  if (loaded" + name + " == null) {\n    returnObject = new GetOrCreateReturn<" + name + ">(create" + name + "(entityId, initialValues), true);\n  } else {\n    returnObject = new GetOrCreateReturn<" + name + ">(loaded" + name + " as " + name + ", false);\n  }\n\n  return returnObject;\n}\n";
}

function getFunction(name) {
  return "\nexport function get" + name + "(entityId: string): " + name + " {\n  entityId = makeSureEntityIdHasCorrectPrefix(entityId);\n  let loaded" + name + " = " + name + ".load(entityId);\n\n  if (loaded" + name + " == null) {\n    logError(\"THIS CODE IS BUGGY! Unable to find entity of type " + name + " with id {}. If this entity hasn't been initialized use the 'getOrInitialize" + name + "' and handle the case that it needs to be initialized.\", [entityId])\n\n    return getOrInitialize" + name + "Default(entityId);\n  }\n\n  return loaded" + name + " as " + name + ";\n}\n";
}

function entityGeneratedCode(idGeneratorFunction, name, fieldDefaultSettersStrict, fieldInitialValues, fieldInitialValueSettersStrict, fieldSetterFunctions) {
  return idGeneratorFunction + getOrInitializeDefaultFunction(name, fieldDefaultSettersStrict) + entityInitialValues(name, fieldInitialValues) + createEntityFunction(name, fieldInitialValueSettersStrict) + getOrInitializeFunction(name) + doesEntityExistFunction(name) + getFunction(name) + fieldSetterFunctions;
}

exports.loadNewEntityId = loadNewEntityId;
exports.setInitializeFieldValue = setInitializeFieldValue;
exports.setField = setField;
exports.setFieldToNewValue = setFieldToNewValue;
exports.setFieldNameToFieldType = setFieldNameToFieldType;
exports.getDefaultValues = getDefaultValues;
exports.toStringConverter = toStringConverter;
exports.unhandledTypeMessage = unhandledTypeMessage;
exports.fieldNotFoundForEntity = fieldNotFoundForEntity;
exports.generateId = generateId;
exports.createSetterFunction = createSetterFunction;
exports.outputCode = outputCode;
exports.getOrInitializeDefaultFunction = getOrInitializeDefaultFunction;
exports.entityInitialValues = entityInitialValues;
exports.createEntityFunction = createEntityFunction;
exports.doesEntityExistFunction = doesEntityExistFunction;
exports.getOrInitializeFunction = getOrInitializeFunction;
exports.getFunction = getFunction;
exports.entityGeneratedCode = entityGeneratedCode;
/* CodegenConfig Not a pure module */
