import { useQuery, gql } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
  query {
    user {
      id
      name
      events {
        id
        name
      }
    }
  }
`;

export default function ProfilePage() {
  
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.currentUser;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Profile: {user.name}</h1>
      <h2 className="text-2xl mb-2">My Events</h2>
      <ul>
        {user.events.map(event => (
          <li key={event.id}>
            <a href={`/events/${event.id}`} className="text-blue-500">
              {event.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
