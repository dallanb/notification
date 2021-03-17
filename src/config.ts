declare var process: {
    env: {
        ENV: string;
        HOST: string;
        PORT: number;
        KAFKA_URL: string;
        KAFKA_TOPICS: string;
        RABBITMQ_HOST: string;
        RABBITMQ_PORT: number;
        RABBITMQ_USERNAME: string;
        RABBITMQ_PASSWORD: string;
        RABBITMQ_VHOST: string;
        CACHE_HOST: string;
        CACHE_PORT: number;
        MONGO_URL: string;
        POSTGRES_URL: string;
    };
};

class Config {
    ENV: string = process.env.ENV;
    HOST: string = process.env.HOST;
    PORT: number = process.env.PORT;
    KAFKA_URL: string = process.env.KAFKA_URL;
    KAFKA_TOPICS: string[] = process.env.KAFKA_TOPICS
        ? process.env.KAFKA_TOPICS.split(',')
        : [];
    RABBITMQ_HOST: string = process.env.RABBITMQ_HOST;
    RABBITMQ_PORT: number = process.env.RABBITMQ_PORT;
    RABBITMQ_USERNAME: string = process.env.RABBITMQ_USERNAME;
    RABBITMQ_PASSWORD: string = process.env.RABBITMQ_PASSWORD;
    RABBITMQ_VHOST: string = process.env.RABBITMQ_VHOST;
    CACHE_HOST: string = process.env.CACHE_HOST;
    CACHE_PORT: number = process.env.CACHE_PORT;
    MONGO_URL: string = process.env.MONGO_URL;
    POSTGRES_URL: string = process.env.POSTGRES_URL;
}

export default new Config();
