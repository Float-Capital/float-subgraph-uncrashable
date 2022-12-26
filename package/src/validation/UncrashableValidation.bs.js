// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Js_dict = require("@rescript/std/lib/js/js_dict.js");
var Belt_Array = require("@rescript/std/lib/js/belt_Array.js");
var Belt_Option = require("@rescript/std/lib/js/belt_Option.js");

require('graphql-import-node/register')
;

var errors = [];

var enumsMap = {};

var interfacesMap = {};

var entitiesMap = {};

var configEntityMap = {};

function confirmTypeIsSupported(argType) {
  switch (argType) {
    case "Address" :
    case "BigDecimal" :
    case "BigInt" :
    case "Boolean" :
    case "Bytes" :
    case "Int" :
    case "String" :
    case "constant" :
        return true;
    default:
      return false;
  }
}

function getNamedType(name) {
  var uncaught = name.value;
  if (uncaught === "String") {
    return "string";
  } else if (uncaught === "Boolean") {
    return "boolean";
  } else if (uncaught === "BigDecimal") {
    return "BigDecimal";
  } else if (uncaught === "Bytes") {
    return "Bytes";
  } else if (uncaught === "Int") {
    return "i32";
  } else if (uncaught === "BigInt") {
    return "BigInt";
  } else if (Belt_Option.isSome(Js_dict.get(configEntityMap, uncaught))) {
    return uncaught;
  } else {
    errors.push("Unexpected entity param: in uncrashable-config.yaml");
    return "Unhandled";
  }
}

function validateFieldType(config, fieldName, _field) {
  while(true) {
    var field = _field;
    var _uncaught = field.type.kind;
    if (_uncaught === "NonNullType") {
      if (Belt_Option.isSome(Js_dict.get(config, fieldName))) {
        _field = field.type;
        continue ;
      }
      errors.push("Missing field: " + fieldName + " in uncrashable-config.yaml");
      return [
              "unhandled",
              false
            ];
    }
    if (_uncaught === "NamedType") {
      var fieldType = getNamedType(field.type.name);
      return [
              fieldType,
              false
            ];
    }
    if (_uncaught !== "ListType") {
      return [
              "uncaught",
              false
            ];
    }
    var match = validateFieldType(config, fieldName, field.type);
    return [
            match[0],
            true
          ];
  };
}

function validateValue(config, rootName) {
  if (!Belt_Option.isSome(Js_dict.get(configEntityMap, rootName))) {
    return ;
  }
  var entity = configEntityMap[rootName];
  var fields = entity.fields;
  var fieldsMap = {};
  Belt_Array.map(fields, (function (field) {
          var fieldName = field.name.value;
          fieldsMap[fieldName] = field;
        }));
  Belt_Array.map(Object.keys(fieldsMap), (function (fieldName) {
          var field = fieldsMap[fieldName];
          if (Belt_Option.isSome(Js_dict.get(config, fieldName))) {
            var configEntity = config[fieldName];
            var match = validateFieldType(config, fieldName, field);
            var fieldType = match[0];
            if (match[1]) {
              if (configEntity.length !== 0) {
                Belt_Array.map(configEntity, (function (listItem) {
                        validateValue(listItem, fieldType);
                      }));
              } else {
                errors.push("Missing elements for field: " + fieldName + " in uncrashable-config.yaml");
              }
            } else {
              validateValue(configEntity, fieldType);
            }
            return ;
          }
          validateFieldType(config, fieldName, field);
        }));
  Belt_Array.map(Object.keys(config), (function (entityName) {
          if (Belt_Option.isSome(Js_dict.get(fieldsMap, entityName)) || Belt_Option.isSome(Js_dict.get(entitiesMap, entityName))) {
            return ;
          } else {
            errors.push("Unexpected field: " + entityName + " in uncrashable-config.yaml");
            return ;
          }
        }));
}

function validateSchema(config) {
  var entitySettings = Belt_Option.getWithDefault(Js_dict.get(config, "entitySettings"), {});
  Belt_Array.map(Object.keys(entitySettings), (function (entityName) {
          if (Belt_Option.isSome(Js_dict.get(entitiesMap, entityName))) {
            return ;
          } else {
            errors.push("Unexpected entity: " + entityName + " in uncrashable-config.yaml");
            return ;
          }
        }));
  Belt_Array.map(Object.keys(entitiesMap), (function (entityName) {
          var entity = entitiesMap[entityName];
          var name = entity.name.value;
          var fields = entity.fields;
          var fieldsMap = {};
          Belt_Array.map(fields, (function (field) {
                  var fieldName = field.name.value;
                  fieldsMap[fieldName] = field;
                }));
          Belt_Option.map(Js_dict.get(entitySettings, name), (function (configEntity) {
                  Belt_Option.getWithDefault(Belt_Option.map(Js_dict.get(configEntity, "setters"), (function (setterFunctions) {
                              Belt_Array.map(setterFunctions, (function (setter) {
                                      var functionName = setter.name;
                                      var functionSetterFields = Belt_Option.getWithDefault(setter.fields, []);
                                      if (Array.isArray(functionSetterFields) && functionSetterFields.length !== 0) {
                                        Belt_Array.map(functionSetterFields, (function (field) {
                                                if (Belt_Option.isSome(Js_dict.get(fieldsMap, field))) {
                                                  return ;
                                                } else {
                                                  errors.push("Unexpected field " + field + " in setter: " + functionName + ", entity: " + entityName + "");
                                                  return ;
                                                }
                                              }));
                                      } else {
                                        errors.push("Missing setter fields for " + functionName + ", entity: " + entityName + "");
                                      }
                                    }));
                            })), undefined);
                  Belt_Option.getWithDefault(Belt_Option.map(Js_dict.get(configEntity, "entityId"), (function (idArgs) {
                              Belt_Array.map(idArgs, (function (arg) {
                                      var argType = Belt_Option.getWithDefault(arg.type, "");
                                      if (!confirmTypeIsSupported(argType)) {
                                        errors.push("Unsupported entityId type " + argType + ", variable name: " + arg.name + ", entity: " + entityName + "");
                                        return ;
                                      }
                                      
                                    }));
                            })), undefined);
                }));
        }));
}

function validate(entityDefinitions, uncrashableConfig) {
  var uncrashableConfigTemplate = require("./uncrashable.graphql");
  var configTemplateDefinitions = uncrashableConfigTemplate.definitions;
  Belt_Array.forEach(entityDefinitions, (function (entity) {
          var name = entity.name.value;
          var entityKind = entity.kind;
          if (entityKind === "InterfaceTypeDefinition") {
            interfacesMap[name] = entity;
          } else if (entityKind === "ObjectTypeDefinition") {
            entitiesMap[name] = entity;
          } else {
            enumsMap[name] = entity;
          }
        }));
  Belt_Array.forEach(configTemplateDefinitions, (function (entity) {
          var name = entity.name.value;
          var entityKind = entity.kind;
          if (entityKind === "InterfaceTypeDefinition") {
            interfacesMap[name] = entity;
          } else if (entityKind === "ObjectTypeDefinition") {
            configEntityMap[name] = entity;
          } else {
            enumsMap[name] = entity;
          }
        }));
  validateValue(uncrashableConfig, "UncrashableConfig");
  validateSchema(uncrashableConfig);
  return errors;
}

exports.errors = errors;
exports.enumsMap = enumsMap;
exports.interfacesMap = interfacesMap;
exports.entitiesMap = entitiesMap;
exports.configEntityMap = configEntityMap;
exports.confirmTypeIsSupported = confirmTypeIsSupported;
exports.getNamedType = getNamedType;
exports.validateFieldType = validateFieldType;
exports.validateValue = validateValue;
exports.validateSchema = validateSchema;
exports.validate = validate;
/*  Not a pure module */
