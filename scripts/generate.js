import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const PROTO_DIR = path.resolve("./protos");
const OUT_DIR = path.resolve("./src/generated");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Recursively find proto files
function findProtoFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory()
      ? findProtoFiles(fullPath)
      : entry.name.endsWith(".proto")
      ? [fullPath]
      : [];
  });
}

const protoFiles = findProtoFiles(PROTO_DIR);
if (protoFiles.length === 0) {
  console.error("No .proto files found");
  process.exit(1);
}

// Handle Windows-specific .cmd extension
let pluginPath = path.resolve("./node_modules/.bin/protoc-gen-ts_proto");
if (os.platform() === "win32") {
  pluginPath += ".cmd";
}

const quotedProtoFiles = protoFiles.map((f) => `"${f}"`).join(" ");

const command = [
  "npx protoc",
  `--plugin="protoc-gen-ts_proto=${pluginPath}"`,
  `--ts_proto_out="${OUT_DIR}"`,
  `--ts_proto_opt=outputServices=grpc-js,esModuleInterop=true`,
  `-I "${PROTO_DIR}"`,
  quotedProtoFiles
].join(" ");

console.log("Running command:\n", command);
execSync(command, { stdio: "inherit" });
