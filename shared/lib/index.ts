import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const prod = process.env.DEPLOY_ENV === 'prod';

export function extractEnv(key: string, dirname: string = __dirname) {
  if (process.env.NODE_ENV === 'production') {
    return process.env[key];
  } else {
    let filePath = join(`${dirname}/.env`);
    if (!existsSync(filePath)) filePath = join(`${dirname}/../.env`);
    if (!existsSync(filePath)) filePath = join(`${dirname}/../../.env`);
    if (!existsSync(filePath)) filePath = join(`${dirname}/../../../.env`);
    if (!existsSync(filePath)) filePath = join(`${dirname}/../../../../.env`);
    if (!existsSync(filePath)) filePath = join(`${dirname}/../../../../../.env`);
    if (!existsSync(filePath)) filePath = join(`${dirname}/../../../../../../.env`);
    if (existsSync(filePath)) {
      const file = readFileSync(filePath).toString();
      const keys = file.split('\n');
      for (let value of keys) {
        value = value.replace(" ", "").replace("\r", '');
        if (value.startsWith(`${key}=`)) return value.replace(`${key}=`, "");
      }
    }
  }
  return undefined;
}
