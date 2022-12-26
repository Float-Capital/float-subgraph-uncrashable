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

function getDefaultValues(graphType) {
  if (graphType === "Boolean") {
    return "false";
  } else if (graphType === "BigDecimal") {
    return "BigDecimal.zero()";
  } else if (graphType === "Bytes") {
    return "Bytes.fromHexString(\"0x00\") as Bytes";
  } else if (graphType === "Address") {
    return "Address.fromString(\"0x0000000000000000000000000000000000000000\")";
  } else if (graphType === "Int") {
    return "0";
  } else if (graphType === "BigInt") {
    return "BigInt.zero()";
  } else {
    return "\"\"";
  }
}

function toStringConverter(paramName, paramType) {
  switch (paramType) {
    case "Address" :
    case "Bytes" :
        return "" + paramName + ".toHex()";
    case "String" :
        return paramName;
    case "BigDecimal" :
    case "BigInt" :
    case "i32" :
        return "" + paramName + ".toString()";
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
  return "import {\n" + entityImports + "\n} from \"./schema\";\nimport {\n  Address,\n  BigInt,\n  Bytes,\n  BigDecimal,\n  log,\n  Entity,\n  dataSource, \n} from \"@graphprotocol/graph-ts\";\n\nexport let NETWORK_NAME = dataSource.network(); // e.g. \"mainnet\", \"matic\", \"avalanche\", \"ropsten\", \"poa-core\"\n\nfunction getIdPrefix(network: string): string {\n" + networkIdPrefix + "\n}\nexport let ENTITY_ID_PREFIX = getIdPrefix(NETWORK_NAME);\n\nfunction ensureEntityIdHasCorrectPrefix(entityId: string): string {\n  if (entityId.startsWith(ENTITY_ID_PREFIX)) {\n    return entityId;\n  } else {\n    return ENTITY_ID_PREFIX + entityId;\n  }\n}\n\nexport class GetOrCreateReturn<EntityType> {\n  entity: EntityType;\n  wasCreated: boolean;\n\n  constructor(entity: EntityType, wasCreated: boolean) {\n    this.entity = entity;\n    this.wasCreated = wasCreated;\n  }\n}\n" + functions + "\n";
}

function getOrInitializeDefaultFunction(name, fieldDefaultSettersStrict) {
  return "\nfunction getOrInitialize" + name + "Default(entityId: string = \"UNINITIALISED - " + name + "\"): " + name + " {\n  entityId = ensureEntityIdHasCorrectPrefix(entityId);\n  let loaded" + name + " = " + name + ".load(entityId);\n\n  if (loaded" + name + " == null) {\n    loaded" + name + " = new " + name + "(entityId);\n    " + fieldDefaultSettersStrict + "\n    loaded" + name + ".save();\n\n    return loaded" + name + ";\n  } else{\n    return loaded" + name + ";\n  }\n}\n";
}

function entityInitialValues(name, fieldInitialValues) {
  return "export class " + name + "InitialValues {\n" + fieldInitialValues + "}\n";
}

function createEntityFunction(name, fieldInitialValueSettersStrict) {
  return "\nexport function create" + name + "(entityId: string, initialValues: " + name + "InitialValues): " + name + " {\n  entityId = ensureEntityIdHasCorrectPrefix(entityId);\n  if (" + CodegenConfig.safeMode + " && " + name + ".load(entityId) != null) {\n      log.warning(\"GRAPH UNCRASHABLE WARNING: Trying to create an entity that already exists. (entityType : " + name + ", entitiyID: {})\", [entityId]);\n\n    return " + name + ".load(entityId) as " + name + ";\n  }\n" + fieldInitialValueSettersStrict + "\n\n  loaded" + name + ".save();\n\n  return loaded" + name + ";\n}\n";
}

function doesEntityExistFunction(name) {
  return "\nexport function does" + name + "Exist(entityId: string): boolean {\n  entityId = ensureEntityIdHasCorrectPrefix(entityId);\n  return " + name + ".load(entityId) != null;\n}\n";
}

function getOrInitializeFunction(name) {
  return "\nexport function getOrInitialize" + name + "(entityId: string, initialValues: " + name + "InitialValues): GetOrCreateReturn<" + name + "> {\n  entityId = ensureEntityIdHasCorrectPrefix(entityId);\n  let loaded" + name + " = " + name + ".load(entityId);\n\n  let returnObject: GetOrCreateReturn<" + name + ">;\n\n  if (loaded" + name + " == null) {\n    returnObject = new GetOrCreateReturn<" + name + ">(create" + name + "(entityId, initialValues), true);\n  } else {\n    returnObject = new GetOrCreateReturn<" + name + ">(loaded" + name + " as " + name + ", false);\n  }\n\n  return returnObject;\n}\n";
}

function getFunction(name) {
  return "\nexport function get" + name + "(entityId: string): " + name + " {\n  entityId = ensureEntityIdHasCorrectPrefix(entityId);\n  let loaded" + name + " = " + name + ".load(entityId);\n\n  if (loaded" + name + " == null) {\n      log.warning(\"GRAPH UNCRASHABLE WARNING: Unable to find entity of type " + name + " with id {}. If this entity hasn't been initialized use the 'getOrInitialize" + name + "' and handle the case that it needs to be initialized.\", [entityId])\n\n    return getOrInitialize" + name + "Default(entityId);\n  }\n\n  return loaded" + name + " as " + name + ";\n}\n";
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
