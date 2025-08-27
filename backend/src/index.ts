import express from "express";
import cors from "cors";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { typeDefs } from "./schema/index.ts";
import resolvers from "./resolvers/index.ts";
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use("/graphql", cors(), express.json(), expressMiddleware(server));

httpServer.listen(8080, () => {
  console.log("Server ready at http://localhost:8080/graphql");
});
