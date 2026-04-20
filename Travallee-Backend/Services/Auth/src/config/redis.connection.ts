interface RedisConfig {
    host: string;
    port: number;
}

export const redisConnection = (Host: string, Port: Number) => {
    return {
        host: Host as string,
        port: Number(Port),
        maxRetriesPerRequest: null,
    }
}
