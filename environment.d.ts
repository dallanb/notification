declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: string;
            PORT: number;
            KAFKA_HOST: string;
            KAFKA_PORT: number;
            KAFKA_TOPICS: string;
            RABBITMQ_HOST: string;
            RABBITMQ_PORT: number;
            RABBITMQ_USERNAME: string;
            RABBITMQ_PASSWORD: string;
            RABBITMQ_VHOST: string;
            REDIS_HOST: string;
            REDIS_PORT: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
