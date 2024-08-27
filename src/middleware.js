import { NextResponse } from 'next/server';

// Función middleware que maneja cada solicitud entrante
export function middleware(request) {
  // Obtener el token de las cookies de la solicitud
  const token = request.cookies.get('authToken');

  // Obtener la ruta de la solicitud
  const { pathname } = request.nextUrl;

  // Verificar si la ruta requiere autenticación
  if (!token && pathname !== '/signin' && pathname !== '/signup') {
    // Redirigir a la página de inicio de sesión si el usuario no está autenticado
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Verificar si la ruta requiere autenticación
  if (token && pathname == '/signin' || token && pathname == '/signup') {
    console.log("next middleware /n");

    // Redirigir al inicio si el usuario ya está autenticado
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Permitir la solicitud si el token existe o si es una ruta pública
  return NextResponse.next();
}

// Configuración para especificar a qué rutas se aplica el middleware
export const config = {
  matcher: [
    '/dashboard/:path*', // Aplica a todas las rutas bajo /dashboard
    '/events/:path*',    // Aplica a todas las rutas bajo /events
    '/create-event',     // Aplica a la ruta /create-event
    '/profile',   
    '/signin',
    '/signup'
  ],
};
