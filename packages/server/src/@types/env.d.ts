declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    TYPEORM_URL: string
    JWT_SECRET: string
    NODE_ENV: string
  }
}
