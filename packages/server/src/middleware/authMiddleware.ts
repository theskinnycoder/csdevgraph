import asyncHandler from "express-async-handler"
import User from "../models/User"
import { decodeJWT } from "../utils/tokens"

// -- Private Routes' Protection Midddleware
export const protect = asyncHandler(async (req, res, next) => {
  // 1. Get the JWT Cookie
  const token = req.cookies["jwt"]
  // 1+. Check if the JWT Cookie is set
  if (token) {
    // 2. If the JWT Cookie is set, check if the payload of the JWT is valid
    const decoded = await decodeJWT(token)
    const { id } = decoded as tokenType
    // 2+. If valid, pass the user to the protected route through the request object
    if (decoded) req.user = await User.findOne({ where: { id } })
    // 2-. If not valid, raise an exception
    else throw new Error("UnAuthenticated! Please login again.")
    next()
  } else {
    // 1-. If the JWT Cookie is not set, raise an exception
    res.status(401)
    throw new Error("UnAuthenticated! Please login again.")
  }
})
