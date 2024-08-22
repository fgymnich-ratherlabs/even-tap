"use client"

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      description
      location
      date
      capacity
    }
  }
`;

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = useQuery(EVENT_QUERY, {
    variables: { id },
  });

  if (loading) return <p className="text-center text-gray-500">Cargando detalles del evento...</p>;
  if (error) return <p className="text-center text-red-500">Error al cargar los detalles del evento</p>;

  const { event } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">{event.name}</h2>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Descripción</h3>
            <p className="mt-1 text-gray-600">{event.description}</p>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Lugar y Fecha</h3>
            <p className="mt-1 text-gray-600">{event.location}</p>
            <p className="mt-1 text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Capacidad</h3>
            <p className="mt-1 text-gray-600">{event.capacity} personas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
