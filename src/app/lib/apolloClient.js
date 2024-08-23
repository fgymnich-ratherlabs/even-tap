import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql', // URL de tu backend GraphQL
  }),
  cache: new InMemoryCache(),
});

export default client;
