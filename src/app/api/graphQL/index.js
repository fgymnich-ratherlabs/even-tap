const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const authenticateMiddleware = require('./middleware/authenticate');
require('dotenv').config();


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

const app = express();
//Express middleware
app.use(express.json());

//graphQLHTTP middleware
app.use('/graphql', authenticateMiddleware, graphqlHTTP((req) => ({
  schema,
  rootValue: root,
  context: req,
  graphiql: true,
})));

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
