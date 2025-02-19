import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { GetRequests, SwitchCronBody } from "../interfaces/requests.js";
import cron from "node-cron";
import { requestsProcessing } from "../../../cron/tasks.js";

let cronTask: cron.ScheduledTask | null = null;

const getRequests = (fastify: FastifyInstance) => {
    return async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
        try {
            const requests: GetRequests[] = await fastify.prisma.request.findMany({
                orderBy: {
                    id: 'asc'
                }
            });
            if(requests.length === 0) return reply.code(404).send({ message: "Requests not found"});
            else return reply.code(200).send(requests);
        }catch(e){
            const error = e as Error;
            return reply.code(500).send({message: error.message || error.stack});
        }
    }
}

const switchCron = (fastify: FastifyInstance) => {
    return async (req: FastifyRequest<{ Body: SwitchCronBody }>, reply: FastifyReply): Promise<FastifyReply> => {
        try {
            const {flag} = req.body;
            if (flag) {
                cronTask = cron.schedule(
                    '*/10 * * * * *',
                    () => requestsProcessing(fastify),
                    {scheduled: true, timezone: 'UTC'}
                )
                cronTask.start();
            }else {
                if(cronTask) {
                    cronTask.stop();
                    cronTask = null;
                }
            }
            return reply.code(200).send({ message: 'Cron switched!'});
        }catch (e) {
            const error = e as Error;
            return reply.code(500).send({message: error.message || error.stack });
        }
    }
}

const Requests = {
    getRequests,
    switchCron
}

export default Requests;