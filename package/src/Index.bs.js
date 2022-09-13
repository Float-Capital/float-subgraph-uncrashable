// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Fs = require("fs");
var Path = require("path");
var Js_exn = require("rescript/lib/js/js_exn.js");
var Js_dict = require("rescript/lib/js/js_dict.js");
var JsYaml = require("js-yaml");
var Belt_Array = require("rescript/lib/js/belt_Array.js");
var Belt_Option = require("rescript/lib/js/belt_Option.js");
var CodegenConfig = require("./CodegenConfig.bs.js");
var Caml_exceptions = require("rescript/lib/js/caml_exceptions.js");
var Caml_js_exceptions = require("rescript/lib/js/caml_js_exceptions.js");
var UncrashableValidation = require("./validation/UncrashableValidation.bs.js");
var GraphEntityGenTemplates = require("./GraphEntityGenTemplates.bs.js");

require('graphql-import-node/register')
;

var UncrashableFileNotFound = /* @__PURE__ */Caml_exceptions.create("Index.UncrashableFileNotFound");

var sourceDir = Path.dirname(CodegenConfig.graphManifest);

console.log(sourceDir);

console.log(CodegenConfig.codegenConfigPath);

function setUncrashableConfigString(param) {
  try {
    return Fs.readFileSync(CodegenConfig.codegenConfigPath, "utf8");
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

var uncrashableConfigString = setUncrashableConfigString(undefined);

var manifestString = Fs.readFileSync(CodegenConfig.graphManifest, "utf8");

var manifest = JsYaml.load(manifestString);

var schemaPath = manifest.schema.file;

console.log(schemaPath);

var absolutePathSchema = Path.resolve(sourceDir, schemaPath);

var loadedGraphSchema = require(absolutePathSchema);

var uncrashableConfig = JsYaml.load(uncrashableConfigString);

var entityDefinitions = loadedGraphSchema.definitions;

var uncrashableConfigErrors = UncrashableValidation.validate(entityDefinitions, uncrashableConfig);

if (uncrashableConfigErrors.length > 0) {
  Js_exn.raiseTypeError(uncrashableConfigErrors.reduce((function (acc, item) {
              return acc + "\n    " + item;
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
  } else if (Belt_Option.isSome(Js_dict.get(entitiesMap, uncaught))) {
    if (entityAsIdString) {
      return "string";
    } else {
      return uncaught;
    }
  } else if (Belt_Option.isSome(Js_dict.get(enumsMap, uncaught))) {
    return "string";
  } else {
    console.log(GraphEntityGenTemplates.unhandledTypeMessage(uncaught));
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
        if (Belt_Option.isSome(Js_dict.get(entitiesMap, field.name.value))) {
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
        return nameOfObject + "." + field.name.value;
    case /* EntityArray */2 :
        return "(" + nameOfObject + "." + field.name.value + ")";
    
  }
}

function getDefaultValueForType(strictMode, recersivelyCreateUncreatedEntities, typeName) {
  return Belt_Option.mapWithDefault(Js_dict.get(entitiesMap, typeName), Belt_Option.mapWithDefault(Js_dict.get(enumsMap, typeName), GraphEntityGenTemplates.getDefaultValues(typeName), (function ($$enum) {
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
                                return arg.name + ": " + arg.type;
                              }));
                        var idString = Belt_Array.joinWith(idArgs, " + \"-\" + ", (function (arg) {
                                if (arg.type !== "constant") {
                                  return GraphEntityGenTemplates.toStringConverter(arg.name, arg.type);
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
            return "  " + entity.name.value;
          })), ",\n", (function (a) {
        return a;
      }));

if (!Fs.existsSync(CodegenConfig.outputEntityFilePath)) {
  Fs.mkdirSync(CodegenConfig.outputEntityFilePath);
}

Fs.writeFileSync(CodegenConfig.outputEntityFilePath + "UncrashableHelpers.ts", GraphEntityGenTemplates.outputCode(entityImports, entityPrefixDefinition, functions), "utf8");

console.log("Output saved to " + CodegenConfig.outputEntityFilePath + "UncrashableHelpers.ts");

var dir = CodegenConfig.outputEntityFilePath;

exports.UncrashableFileNotFound = UncrashableFileNotFound;
exports.sourceDir = sourceDir;
exports.setUncrashableConfigString = setUncrashableConfigString;
exports.uncrashableConfigString = uncrashableConfigString;
exports.manifestString = manifestString;
exports.manifest = manifest;
exports.schemaPath = schemaPath;
exports.absolutePathSchema = absolutePathSchema;
exports.loadedGraphSchema = loadedGraphSchema;
exports.uncrashableConfig = uncrashableConfig;
exports.entityDefinitions = entityDefinitions;
exports.uncrashableConfigErrors = uncrashableConfigErrors;
exports.enumsMap = enumsMap;
exports.interfacesMap = interfacesMap;
exports.entitiesMap = entitiesMap;
exports.getNamedType = getNamedType;
exports.getFieldType = getFieldType;
exports.getFieldSetterType = getFieldSetterType;
exports.getFieldValueToSave = getFieldValueToSave;
exports.getDefaultValueForType = getDefaultValueForType;
exports.entityPrefixConfig = entityPrefixConfig;
exports.entityPrefixDefinition = entityPrefixDefinition;
exports.getFieldDefaultTypeNonNull = getFieldDefaultTypeNonNull;
exports.getFieldDefaultTypeWithNull = getFieldDefaultTypeWithNull;
exports.functions = functions;
exports.entityImports = entityImports;
exports.dir = dir;
/*  Not a pure module */
