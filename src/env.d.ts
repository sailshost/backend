declare namespace NodeJS {
  export interface ProcessEnv {
    REDIS_IP: string;
    DATABASE_URL: string;
    NODE_ENV: string;
    SENDGRID_API_KEY: string;
  }
}
