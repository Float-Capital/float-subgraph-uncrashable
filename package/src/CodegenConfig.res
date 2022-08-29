@val external process: 'a = "process"
let env = process["env"]

let gqlSchema = env["GQL_SCHEMA"]->Option.getWithDefault("../../schema.graphql")
let graphConfig = env["GRAPH_CONFIG"]->Option.getWithDefault("../subgraph.yaml")
let codegenConfigPath =
  env["CODEGEN_CONFIG_PATH"]->Option.getWithDefault("../uncrashable-config.yaml")
let generatedFolderName = env["GENERATED_FOLDER_NAME"]->Option.getWithDefault("../generated")
let outputEntityFilePath = `../src/${generatedFolderName}/`
