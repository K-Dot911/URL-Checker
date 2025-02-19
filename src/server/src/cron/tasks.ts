import { FastifyInstance } from "fastify";
import { GetRequests } from "../routes/auth/interfaces/requests.js";
import { PrismaClient } from "@prisma/client";

const isSuccessful = (status: number): boolean => status >= 200 && status < 300;

const updateRequest = async(
    prisma: PrismaClient,
    id: number, status: 'NEW' | 'DONE' | 'PROCESSING' | 'ERROR',
    code: number | null = null
): Promise<void> => {
    await prisma.request.update({
        where: { id },
        data: { status, httpCode: code },
    })
}

const requestsProcessing = async (fastify: FastifyInstance): Promise<void> => {
    try{
        const requests: GetRequests[] = await fastify.prisma.request.findMany({
            where: {
                status: 'NEW'
            },
            take: parseInt(process.env["REQ_NUMBER_LIMIT"] || '5')
        });
        if(requests.length === 0) return;
        await fastify.prisma.request.updateMany(
            {
                where: {
                    id: { in: requests.map((r: GetRequests) => r.id) }
                },
                data: {
                    status: 'PROCESSING'
                }
            }
        );
        await Promise.allSettled(
            requests.map(async (request: GetRequests): Promise<void> => {
                try {
                    const response: Response = await fetch(request.url);
                    const isSuccess: boolean = isSuccessful(response.status);
                    if(isSuccess) {
                        await updateRequest(fastify.prisma, request.id, 'DONE', response.status);
                    } else {
                        await updateRequest(fastify.prisma, request.id, 'ERROR');
                    }
                }catch(e) {
                    await updateRequest(fastify.prisma, request.id, 'ERROR');
                }
            })
        );
    }catch (e) {
        const error = e as Error;
        console.error(error);
    }
}

export {
    requestsProcessing,
}