const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { error } = require('console');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
require('dotenv').config();

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
        console.log("user created w prisma ", user);
        return user.name;
      } catch (error) {
        console.error('Error al crear el usuario:', error);
      }
    },
    signin: async ({ email, password }) => {
      console.log('Signin called with:', { email, password });
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      return jwt.sign({ userId: user.id, role: user.role,  }, process.env.SECRET_KEY, { expiresIn: '1h' });  
    },
    createEvent: async ({ name, description, location, date, maxCapacity }, context) => {
      const user = await authenticate(context);
      //if (user.role !== 'ORGANIZER') throw new Error('Not authorized');
      return await prisma.event.create({
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
    },
    applyToEvent: async ({ eventId }, context) => {
      const user = await authenticate(context);
      console.log("application called with userId, eventId: ", user.userId,parseInt(eventId));
      return await prisma.application.create({
        data: {
          user: { connect: { id: parseInt(user.userId) } },
          event: { connect: { id: parseInt(eventId) } },
        },
      });
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