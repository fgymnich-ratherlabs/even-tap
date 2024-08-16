const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const root = {
    users: async () => {
      return await prisma.user.findMany();
    },
    events: async () => {
      return await prisma.event.findMany({ include: { organizer: true } });
    },
    event: async ({ id }) => {
      return await prisma.event.findUnique({ where: { id: parseInt(id) }, include: { organizer: true } });
    },
    signup: async ({ name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try{
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return jwt.sign({ userId: user.id, role: user.role }, 'SECRET_KEY');
      } catch (error) {
        console.error('Error al crear el usuario:', error);
      }
    },
    login: async ({ email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      return jwt.sign({ userId: user.id, role: user.role }, 'SECRET_KEY');
    },
    createEvent: async ({ name, description, location, date, maxCapacity }, context) => {
      const user = await authenticate(context);
      if (user.role !== 'ORGANIZER') throw new Error('Not authorized');
      return await prisma.event.create({
        data: {
          name,
          description,
          location,
          date: new Date(date),
          maxCapacity,
          organizer: { connect: { id: user.userId } },
        },
      });
    },
    applyToEvent: async ({ eventId }, context) => {
      const user = await authenticate(context);
      return await prisma.application.create({
        data: {
          user: { connect: { id: user.userId } },
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