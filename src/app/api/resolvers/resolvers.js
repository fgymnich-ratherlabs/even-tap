const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { error } = require('console');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
require('dotenv').config();
const { UserInputError } = require('apollo-server-express'); 


const authenticate = async (context) => {
    const authHeader = context.headers.authorization;
    if (!authHeader) throw new Error('Not authenticated');
    const token = authHeader.replace('Bearer ', '');
    try {
      decripted = jwt.verify(token, process.env.SECRET_KEY);
      //agregar expiry
      return decripted; //devuelve el token desencriptado
    } catch (e) {
      throw new Error('Invalid token');
    }
  };

const root = {
    users: async () => {
      return await prisma.user.findMany();
    },
    events: async () => {
      return await prisma.event.findMany({ include: { organizer: true } });
    },
    event: async ({ id }) => {
      if (!id){
        throw new Error('Id necesario.');
      }
      return await prisma.event.findUnique({ where: { id: parseInt(id) }, include: { organizer: true },});
    },

    signup: async ({ name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Signup called with:', { name, email, password });

      // 1. Validar si los campos existen y son válidos
      if (!name || !email || !password) {
        throw new Error('Todos los campos son obligatorios.');
      }

      // 2. Verificar si el usuario ya existe en la base de datos (ejemplo utilizando Prisma)
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('Ya existe un usuario con ese email.');
      }
  
      try{
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return user.name;
      } catch (error) {
        console.error('Error al crear el usuario:', error);
      }
    },
    signin: async ({ email, password }) => {
      try{
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');
        return jwt.sign({ userId: user.id, role: user.role,  }, process.env.SECRET_KEY, { expiresIn: '1h' });
      }catch(error) {
        console.error('Usuario o Clave incorrectas');
      }  
    },
    createEvent: async ({ name, description, location, date, maxCapacity }, context) => {
      const user = await authenticate(context);
      //if (user.role !== 'ORGANIZER') throw new Error('Not authorized');

      try { 
          const event = await prisma.event.create({
            data: {
              name,
              description,
              location,
              date: new Date(date), //borrar?
              maxCapacity,
              organizer: { connect: { id: user.userId } },
            },
            include: {
              organizer: true, // Para incluir la información del organizador en la respuesta
            },
          });
          return event;
      }catch(error){
        console.error('Error al crear el evento:', error);
      }
    },

    applyToEvent: async ({ eventId }, context) => {
      const user = await authenticate(context);
      const userId = parseInt(user.userId);
      const parsedEventId = parseInt(eventId);

      // Verificar si ya existe una aplicación para el usuario y el evento
      const existingApplication = await prisma.application.findUnique({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: parsedEventId,
          },
        },
      });

      if (existingApplication) {
        throw new UserInputError('Ya has aplicado a este evento.', {
          invalidArgs: { eventId },
        });
      }

      try{
        const application = await prisma.application.create({
          data: {
            user: { connect: { id: userId } },
            event: { connect: { id: parsedEventId } },
          },
          include: {
            user: true,
          }
        });

        return application;
      }catch(error){
        console.error('Error al aplicar al evento:', error); 
      }
    },

    manageApplication: async ({ applicationId, status }, context) => {
      const user = await authenticate(context);
      const application = await prisma.application.findUnique({
        where: { id: parseInt(applicationId) },
        include: { event: true },
      });
      if (application.event.organizerId !== user.userId) throw new Error('Not authorized');
      return await prisma.application.update({
        where: { id: parseInt(applicationId) },
        data: { status },
      });
    },
  };

  module.exports = root;