import "reflect-metadata"
import { createConnection } from "typeorm"
import User from "../models/User"
import { __is_prod__ } from "./constants"

export default async () => {
  try {
    const conn = await createConnection({
      type: "postgres",
      url: process.env.TYPEORM_URL,
      logging: !__is_prod__,
      synchronize: !__is_prod__,
      entities: [User]
    })
    console.log(`Connected to the ${conn.name} PostgreSQL DataBase...`)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
