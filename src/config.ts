declare var process: {
    env: {
        ENV: string;
        PORT: number;
        KAFKA_HOST: string;
        KAFKA_PORT: number;
        KAFKA_TOPICS: string;
        RABBITMQ_HOST: string;
        RABBITMQ_PORT: number;
        RABBITMQ_USERNAME: string;
        RABBITMQ_PASSWORD: string;
    };
};

class Config {
    ENV: string = process.env.ENV;
    PORT: number = process.env.PORT;
    KAFKA_HOST: string = process.env.KAFKA_HOST;
    KAFKA_PORT: number = process.env.KAFKA_PORT;
    KAFKA_TOPICS: Array<string> = process.env.KAFKA_TOPICS
        ? process.env.KAFKA_TOPICS.split(',')
        : [];
    RABBITMQ_HOST: string = process.env.RABBITMQ_HOST;
    RABBITMQ_PORT: number = process.env.RABBITMQ_PORT;
    RABBITMQ_USERNAME: string = process.env.RABBITMQ_USERNAME;
    RABBITMQ_PASSWORD: string = process.env.RABBITMQ_PASSWORD;
}

export default new Config();
