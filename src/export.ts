export const SAILS_COOKIE: string = "sails.auth";
export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;
