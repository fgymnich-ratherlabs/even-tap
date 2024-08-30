"use client"

import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';

const EVENTS_QUERY = gql`
  query GetEvents {
    events {
      id
      name
      description
      location
      date
      maxCapacity
      organizer {
        id
        name
      }
    }
  }
`;

export default function Dashboard() {
  const { data, loading, error } = useQuery(EVENTS_QUERY);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (data && data.events) {
      setEvents(data.events);
    }
  }, [data]);

  if (loading) return <p className="text-center text-gray-500">Cargando eventos...</p>;
/*   if (error && error.networkError && error.networkError.statusCode !== 401) {
    return <ErrorMessage message="Error al cargar eventos:" details={error.message} />;
  } */
  if (error) return <p className="text-center text-red-500">Error al cargar eventos</p>;
}
