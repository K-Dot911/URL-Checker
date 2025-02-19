import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';
import { FastifyInstance } from "fastify";

const prisma: PrismaClient = new PrismaClient();


const prismaPlugin = fp(async (fastify: FastifyInstance) => {
    fastify.decorate('prisma', prisma);
    fastify.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export default prismaPlugin;