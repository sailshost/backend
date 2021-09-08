declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    PORT: number;
    REDIS_IP: string;
  }
}
