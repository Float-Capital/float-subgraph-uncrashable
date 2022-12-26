// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Fs = require("fs");
var Js_exn = require("@rescript/std/lib/js/js_exn.js");
var Js_dict = require("@rescript/std/lib/js/js_dict.js");
var JsYaml = require("js-yaml");
var Belt_Array = require("@rescript/std/lib/js/belt_Array.js");
var Belt_Option = require("@rescript/std/lib/js/belt_Option.js");
var Caml_exceptions = require("@rescript/std/lib/js/caml_exceptions.js");
var Caml_js_exceptions = require("@rescript/std/lib/js/caml_js_exceptions.js");
var UncrashableValidation = require("./validation/UncrashableValidation.bs.js");
var GraphEntityGenTemplates = require("./GraphEntityGenTemplates.bs.js");

require('graphql-import-node/register')
;

var UncrashableFileNotFound = /* @__PURE__ */Caml_exceptions.create("Index.UncrashableFileNotFound");

function setUncrashableConfigString(codegenConfigPath) {
  try {
    return Fs.readFileSync(codegenConfigPath, "utf8");
  }
  catch (raw_obj){
    var obj = Caml_js_exceptions.internalToOCamlException(raw_obj);
    if (obj.RE_EXN_ID === Js_exn.$$Error) {
      var m = obj._1.message;
      if (m !== undefined) {
        throw {
              RE_EXN_ID: UncrashableFileNotFound,
              _1: "Uncrashable yaml config not found: " + m,
              Error: new Error()
            };
      }
      return "";
    }
    throw obj;
  }
}

function getNamedType(entityAsIdString, name) {
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
  } else if (Belt_Option.isSome(Js_dict.get(UncrashableValidation.entitiesMap, uncaught))) {
    if (entityAsIdString) {
      return "string";
    } else {
      return uncaught;
    }
  } else if (Belt_Option.isSome(Js_dict.get(UncrashableValidation.enumsMap, uncaught))) {
    return "string";
  } else {
    console.log(GraphEntityGenTemplates.unhandledTypeMessage(uncaught));
    return "UNHANDLED_TYPE";
  }
}

function getAssemblyScriptTypeFromConfigType(configType) {
  if (configType === "String") {
    return "string";
  } else if (configType === "Boolean") {
    return "boolean";
  } else if (configType === "BigDecimal") {
    return "BigDecimal";
  } else if (configType === "Bytes") {
    return "Bytes";
  } else if (configType === "Int") {
    return "i32";
  } else if (configType === "BigInt") {
    return "BigInt";
  } else if (configType === "constant") {
    console.log("Please report a bug on github. This case shouldn't happen");
    return "";
  } else if (Belt_Option.isSome(Js_dict.get(UncrashableValidation.entitiesMap, configType))) {
    return configType;
  } else if (Belt_Option.isSome(Js_dict.get(UncrashableValidation.enumsMap, configType))) {
    return "string";
  } else {
    console.log(GraphEntityGenTemplates.unhandledTypeMessage(configType));
    return "UNHANDLED_TYPE";
  }
}

function getFieldType(_entityAsIdStringOpt, _field) {
  while(true) {
    var entityAsIdStringOpt = _entityAsIdStringOpt;
    var field = _field;
    var entityAsIdString = entityAsIdStringOpt !== undefined ? entityAsIdStringOpt : false;
    var uncaught = field.kind;
    if (uncaught === "NonNullType") {
      _field = field.type;
      _entityAsIdStringOpt = entityAsIdString;
      continue ;
    }
    if (uncaught === "NamedType") {
      return getNamedType(entityAsIdString, field.name);
    }
    if (uncaught === "ListType") {
      var innerType = getFieldType(entityAsIdString, field.type);
      return "Array<" + innerType + ">";
    }
    console.log(uncaught);
    return "unknown";
  };
}

function getFieldSetterType(_field) {
  while(true) {
    var field = _field;
    var uncaught = field.kind;
    if (uncaught !== "NonNullType") {
      if (uncaught === "NamedType") {
        if (Belt_Option.isSome(Js_dict.get(UncrashableValidation.entitiesMap, field.name.value))) {
          return /* Entity */1;
        } else {
          return /* NormalValue */0;
        }
      } else if (uncaught === "ListType") {
        if (getFieldSetterType(field.type) === /* Entity */1) {
          return /* EntityArray */2;
        } else {
          return /* NormalValue */0;
        }
      } else {
        console.log("Uncaught entity type", uncaught);
        return /* NormalValue */0;
      }
    }
    _field = field.type;
    continue ;
  };
}

function getFieldValueToSave(nameOfObject, field) {
  var match = getFieldSetterType(field.type);
  switch (match) {
    case /* NormalValue */0 :
    case /* Entity */1 :
        return "" + nameOfObject + "." + field.name.value + "";
    case /* EntityArray */2 :
        return "(" + nameOfObject + "." + field.name.value + ")";
    
  }
}

function getDefaultValueForType(strictMode, recersivelyCreateUncreatedEntities, typeName) {
  return Belt_Option.mapWithDefault(Js_dict.get(UncrashableValidation.entitiesMap, typeName), Belt_Option.mapWithDefault(Js_dict.get(UncrashableValidation.enumsMap, typeName), GraphEntityGenTemplates.getDefaultValues(typeName), (function ($$enum) {
                    return "\"" + $$enum.values[0].name.value + "\"";
                  })), (function (_entityType) {
                if (recersivelyCreateUncreatedEntities) {
                  return "\"UNINITIALISED - " + typeName + "\"";
                } else {
                  return "getOrInitialize" + typeName + "Default(\"UNINITIALISED - " + typeName + "\", " + (
                          strictMode ? "true" : "false"
                        ) + ").id";
                }
              }));
}

function getFieldDefaultTypeNonNull(strictMode, recersivelyCreateUncreatedEntities, _field) {
  while(true) {
    var field = _field;
    var uncaught = field.kind;
    if (uncaught !== "NonNullType") {
      if (uncaught === "NamedType") {
        return getDefaultValueForType(strictMode, recersivelyCreateUncreatedEntities, field.name.value);
      } else if (uncaught === "ListType") {
        return "[]";
      } else {
        console.log(uncaught);
        return "unknown";
      }
    }
    _field = field.type;
    continue ;
  };
}

function getFieldDefaultTypeWithNull(strictModeOpt, recersivelyCreateUncreatedEntitiesOpt, field) {
  var strictMode = strictModeOpt !== undefined ? strictModeOpt : true;
  var recersivelyCreateUncreatedEntities = recersivelyCreateUncreatedEntitiesOpt !== undefined ? recersivelyCreateUncreatedEntitiesOpt : false;
  var uncaught = field.kind;
  if (uncaught === "NonNullType") {
    return getFieldDefaultTypeNonNull(strictMode, recersivelyCreateUncreatedEntities, field.type);
  } else if (uncaught === "ListType" || uncaught === "NamedType") {
    return "null";
  } else {
    console.log(uncaught);
    return "unknown";
  }
}

function run(entityDefinitions, codegenConfigPath, outputFilePath) {
  var uncrashableConfigString = setUncrashableConfigString(codegenConfigPath);
  var uncrashableConfig = JsYaml.load(uncrashableConfigString);
  var uncrashableConfigErrors = UncrashableValidation.validate(entityDefinitions, uncrashableConfig);
  if (uncrashableConfigErrors.length > 0) {
    Js_exn.raiseTypeError(uncrashableConfigErrors.reduce((function (acc, item) {
                return "" + acc + "\n    " + item + "";
              }), ""));
  }
  var enumsMap = {};
  var interfacesMap = {};
  var entitiesMap = {};
  Belt_Array.forEach(entityDefinitions, (function (entity) {
          var name = entity.name.value;
          var entityKind = entity.kind;
          if (name !== "_Schema_") {
            if (entityKind === "InterfaceTypeDefinition") {
              interfacesMap[name] = entity;
            } else if (entityKind === "ObjectTypeDefinition") {
              entitiesMap[name] = entity;
            } else {
              enumsMap[name] = entity;
            }
            return ;
          }
          
        }));
  var entityPrefixConfig = Belt_Option.getWithDefault(uncrashableConfig.networkConfig.entityIdPrefixes, []);
  var entityPrefixDefinition = entityPrefixConfig.length > 1 ? "  if " + Belt_Array.joinWith(Belt_Array.map(entityPrefixConfig, (function (param) {
                return "(" + Belt_Array.joinWith(Belt_Array.map(param.networks, (function (network) {
                                  return "network == \"" + network + "\"";
                                })), " || ", (function (a) {
                              return a;
                            })) + ") {\n  return \"" + param.prefix + "\";\n}";
              })), " else if ", (function (a) {
            return a;
          })) + " else {\n    return \"\";\n  }" : "  return \"\";";
  var functions = Belt_Array.joinWith(Belt_Array.map(Object.keys(entitiesMap), (function (entityName) {
              var entity = entitiesMap[entityName];
              var name = entity.name.value;
              var fields = entity.fields;
              var fieldsMap = {};
              Belt_Array.map(fields, (function (field) {
                      var fieldName = field.name.value;
                      fieldsMap[fieldName] = field;
                    }));
              var entityConfig = Belt_Option.getWithDefault(Js_dict.get(uncrashableConfig.entitySettings, name), {
                    useDefault: {},
                    entityId: undefined,
                    setters: undefined
                  });
              var fieldDefaultSettersStrict = Belt_Array.joinWith(Belt_Array.map(fields, (function (field) {
                          var fieldName = field.name.value;
                          if (fieldName === "id") {
                            return "";
                          } else {
                            return GraphEntityGenTemplates.setInitializeFieldValue(name, fieldName, getFieldDefaultTypeWithNull(undefined, true, field.type));
                          }
                        })), "\n  ", (function (a) {
                      return a;
                    }));
              var fieldsWithDefaultValueLookup = entityConfig.useDefault;
              var fieldInitialValueSettersStrict = Belt_Array.joinWith(Belt_Array.map(fields, (function (field) {
                          var fieldName = field.name.value;
                          if (fieldName === "id") {
                            return GraphEntityGenTemplates.loadNewEntityId(name);
                          }
                          var fieldNameOrEntityIds = getFieldValueToSave("initialValues", field);
                          return Belt_Option.mapWithDefault(Js_dict.get(fieldsWithDefaultValueLookup, fieldName), GraphEntityGenTemplates.setInitializeFieldValue(name, fieldName, fieldNameOrEntityIds), (function (_fieldDefaultConfig) {
                                        return GraphEntityGenTemplates.setInitializeFieldValue(name, fieldName, getFieldDefaultTypeWithNull(false, undefined, field.type));
                                      }));
                        })), "\n", (function (a) {
                      return a;
                    }));
              var fieldToFieldTyping = function (field) {
                var fieldName = field.name.value;
                if (fieldName === "id") {
                  return "";
                } else {
                  return Belt_Option.mapWithDefault(Js_dict.get(fieldsWithDefaultValueLookup, fieldName), GraphEntityGenTemplates.setFieldNameToFieldType(fieldName, getFieldType(true, field.type)), (function (param) {
                                return "";
                              }));
                }
              };
              var fieldInitialValues = Belt_Array.joinWith(Belt_Array.map(fields, fieldToFieldTyping), "", (function (a) {
                      return a;
                    }));
              var idGeneratorFunction = Belt_Option.getWithDefault(Belt_Option.map(entityConfig.entityId, (function (idArgs) {
                          var argsDefinition = Belt_Array.joinWith(Belt_Array.keep(idArgs, (function (arg) {
                                      return arg.type !== "constant";
                                    })), ",", (function (arg) {
                                  return "" + arg.name + ": " + getAssemblyScriptTypeFromConfigType(arg.type) + "";
                                }));
                          var idString = Belt_Array.joinWith(idArgs, " + \"-\" + ", (function (arg) {
                                  if (arg.type !== "constant") {
                                    return GraphEntityGenTemplates.toStringConverter(arg.name, getAssemblyScriptTypeFromConfigType(arg.type));
                                  } else {
                                    return "\"" + arg.value + "\"";
                                  }
                                }));
                          return GraphEntityGenTemplates.generateId(name, argsDefinition, idString);
                        })), "");
              var fieldSetterFunctions = Belt_Option.getWithDefault(Belt_Option.map(entityConfig.setters, (function (setterFunctions) {
                          return Belt_Array.joinWith(Belt_Array.map(setterFunctions, (function (setter) {
                                            var functionName = setter.name;
                                            var functionSetterFields = setter.fields;
                                            var fieldTypeDef = Belt_Array.joinWith(Belt_Array.map(functionSetterFields, (function (field) {
                                                        return Belt_Option.mapWithDefault(Js_dict.get(fieldsMap, field), GraphEntityGenTemplates.fieldNotFoundForEntity(field, functionName, name), (function (fieldDefinition) {
                                                                      return GraphEntityGenTemplates.setField(field, getFieldType(true, fieldDefinition.type));
                                                                    }));
                                                      })), "", (function (a) {
                                                    return a;
                                                  }));
                                            var fieldTypeSetters = Belt_Array.joinWith(Belt_Array.map(functionSetterFields, (function (field) {
                                                        return Belt_Option.mapWithDefault(Js_dict.get(fieldsMap, field), GraphEntityGenTemplates.fieldNotFoundForEntity(field, functionName, name), (function (param) {
                                                                      return GraphEntityGenTemplates.setFieldToNewValue(field);
                                                                    }));
                                                      })), "", (function (a) {
                                                    return a;
                                                  }));
                                            return GraphEntityGenTemplates.createSetterFunction(functionName, fieldTypeDef, name, fieldTypeSetters);
                                          })), "\n", (function (arg) {
                                        return arg;
                                      }));
                        })), "");
              return GraphEntityGenTemplates.entityGeneratedCode(idGeneratorFunction, name, fieldDefaultSettersStrict, fieldInitialValues, fieldInitialValueSettersStrict, fieldSetterFunctions);
            })), "\n", (function (a) {
          return a;
        }));
  var entityImports = Belt_Array.joinWith(Belt_Array.map(Belt_Array.keep(entityDefinitions, (function (entity) {
                  if (entity.kind !== "EnumTypeDefinition" && entity.kind !== "InterfaceTypeDefinition") {
                    return entity.name.value !== "_Schema_";
                  } else {
                    return false;
                  }
                })), (function (entity) {
              return "  " + entity.name.value + "";
            })), ",\n", (function (a) {
          return a;
        }));
  if (!Fs.existsSync(outputFilePath)) {
    Fs.mkdirSync(outputFilePath);
  }
  Fs.writeFileSync("" + outputFilePath + "/UncrashableEntityHelpers.ts", GraphEntityGenTemplates.outputCode(entityImports, entityPrefixDefinition, functions), "utf8");
  console.log("Output saved to " + outputFilePath + "/UncrashableEntityHelpers.ts");
}

exports.UncrashableFileNotFound = UncrashableFileNotFound;
exports.setUncrashableConfigString = setUncrashableConfigString;
exports.getNamedType = getNamedType;
exports.getAssemblyScriptTypeFromConfigType = getAssemblyScriptTypeFromConfigType;
exports.getFieldType = getFieldType;
exports.getFieldSetterType = getFieldSetterType;
exports.getFieldValueToSave = getFieldValueToSave;
exports.getDefaultValueForType = getDefaultValueForType;
exports.getFieldDefaultTypeNonNull = getFieldDefaultTypeNonNull;
exports.getFieldDefaultTypeWithNull = getFieldDefaultTypeWithNull;
exports.run = run;
/*  Not a pure module */
