declare namespace NodeJS {
  export interface ProcessEnv {
    IS_PROD: boolean;
    DATABASE_URL: string;
    IP: string,
    SENDGRID_API_KEY: string;
  }
}
