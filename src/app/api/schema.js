const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type User {
      id: ID!
      name: String!
      email: String!
      role: String!
    }
  
    type Event {
      id: ID!
      name: String!
      description: String!
      location: String!
      date: String!
      maxCapacity: Int!
      organizer: User!
    }
  
    type Application {
      id: ID!
      status: String!
      user: User!
      event: Event!
    }
  
    type Query {
      users: [User!]!
      events: [Event!]!
      event(id: ID!): Event
    }
  
    type Mutation {
      signup(name: String!, email: String!, password: String!): String
      login(email: String!, password: String!): String
      createEvent(name: String!, description: String!, location: String!, date: String!, maxCapacity: Int!): Event
      applyToEvent(eventId: ID!): Application
      manageApplication(applicationId: ID!, status: String!): Application
    }
  `);

  module.exports = schema;