import prismaPlugin from "./plugins/prisma.js";
import fastify, { FastifyInstance } from "fastify";
import autoLoad from "@fastify/autoload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "@fastify/cors";
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

class UrlCheckerAPI {
    private fastify: FastifyInstance;
    constructor() {
        this.fastify = fastify();
    }

    async start(): Promise<void> {
        this.registerPlugins();
        this.startFastify();
    }

    registerPlugins(): void {
        this.fastify.register(prismaPlugin);
        this.fastify.register(autoLoad, {
            dir: path.join(__dirname, './routes'),
            ignorePattern: /(?:interfaces|schema|handlers)/,
            maxDepth: 3
        });
        this.fastify.register(cors, {
            origin: process.env["CLIENT_HOST"],
            methods: ["GET", "POST", "PUT", "DELETE"],
        });
    }

    startFastify(): void {
        const port: number = parseInt(process.env["PORT"] || "8080");
        const host: string = process.env["HOST"] || "localhost";
        console.log(port, host);
        this.fastify.listen({ port, host }, err => {
            if (err) {
                console.error(err);
                process.exit(1)
            }
            console.log('Server started on port', port);
        })
    }
}

export default UrlCheckerAPI;
