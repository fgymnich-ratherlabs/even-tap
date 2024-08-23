const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
//import { NextResponse } from 'next/server';
//const valid = require('schema-validations/validations');//TODO
/* import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import cors from "cors"; */

//Esquema de resolvers
const schema = require('./schema');

//GraphQL Resolvers
const root = require('./resolvers/resolvers');




//todo esto vvvvvvv hay q cambiarlo por que corra en vercel
const app = express();
//Express middleware
app.use(express.json());

//graphQLHTTP middleware
app.use('/graphql', graphqlHTTP((req) => ({
  schema,
  rootValue: root,
  context: req,
  graphiql: true,
})));

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
