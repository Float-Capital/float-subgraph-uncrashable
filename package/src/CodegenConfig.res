@val external process: 'a = "process"
let env = process["env"]

let gqlSchema = env["GQL_SCHEMA"]->Option.getWithDefault("../schema.graphql")
let graphConfig = env["GRAPH_CONFIG"]->Option.getWithDefault("./subgraph.yaml")
let codegenConfigPath = env["CODEGEN_CONFIG_PATH"]->Option.getWithDefault("./config.yaml")
let genaretdFolderName = env["GENERATED_FOLDER_NAME"]->Option.getWithDefault("generated")
let outputTestFilePath = `./tests/${genaretdFolderName}/`
let outputEntityFilePath = `./src/${genaretdFolderName}/`
