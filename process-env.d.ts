declare namespace NodeJS {
  export interface ProcessEnv {
    readonly PORT: string;
    readonly VERCEL_URL: string;
    readonly MONGO_URL: string;
  }
}
