import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROTO_PATH = path.join(__dirname, "../protos/stores.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});


const grpcObject = grpc.loadPackageDefinition(packageDefinition) as unknown as {
  storesData: any; 
};



const StoreProto = grpcObject.storesData;


const server = new grpc.Server()
server.bindAsync("0.0.0.0:5000" , grpc.ServerCredentials.createInsecure() , (err , data)=>{
    if(err)console.log(err)
    console.log(data)
})

export {StoreProto}


export * from './generated/stores.js'
