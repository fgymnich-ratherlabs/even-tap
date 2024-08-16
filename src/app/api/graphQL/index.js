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
cd
//GraphQL Resolvers
const root = require('./resolvers/resolvers');


const authenticate = async (context) => {
  const authHeader = context.headers.authorization;
  if (!authHeader) throw new Error('Not authenticated');
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, 'SECRET_KEY');
  } catch (e) {
    throw new Error('Invalid token');
  }
};

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
