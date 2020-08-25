export default {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    KAFKA_HOST: process.env.KAFKA_HOST,
    KAFKA_PORT: process.env.KAFKA_PORT,
    KAFKA_TOPICS: process.env.KAFKA_TOPICS
        ? process.env.KAFKA_TOPICS.split(',')
        : [],
    RABBITMQ_HOST: process.env.RABBITMQ_HOST,
    RABBITMQ_PORT: process.env.RABBITMQ_PORT,
};
