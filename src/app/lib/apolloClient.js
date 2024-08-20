import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Configura el enlace HTTP a tu servidor GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Cambia esta URL según sea necesario
});

// Configura el enlace de autenticación (opcional)
const authLink = setContext((_, { headers }) => {
  // Obtén el token de autenticación desde localStorage o cookies
  const token = localStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Crea la instancia de Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
