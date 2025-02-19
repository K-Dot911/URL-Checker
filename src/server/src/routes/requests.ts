import { FastifyInstance } from "fastify";
import { getRequests, switchCron } from "./auth/schema/requests.js";
import Requests from "./auth/handlers/requests.js"

export default async function (fastify: FastifyInstance): Promise<void> {
    fastify.get('/requests', { schema: getRequests }, Requests.getRequests(fastify));
    fastify.post('/switch-cron', { schema: switchCron }, Requests.switchCron(fastify));
}