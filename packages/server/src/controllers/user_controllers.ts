import asyncHandler from "express-async-handler"
import User from "../models/User"
import { __is_prod__ } from "../utils/constants"
import { encodeJWT } from "../utils/tokens"

// -- POST    /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { handle, email, password } = req.body

  // 1-. If user already exists, raise an error
  if (await User.findOne({ where: { email } }))
    throw new Error(
      "There already exists an account registered with this email. Try Again"
    )
  else if (await User.findOne({ where: { handle } }))
    throw new Error("This handle is taken. Try Again")
  else {
    // 1+. Else create the new user
    const { id } = await User.create({
      handle,
      email,
      password
    }).save()
    // 2. Create a token for the new user and set the cookie
    res.cookie("jwt", await encodeJWT({ id }), {
      httpOnly: true,
      sameSite: true,
      secure: __is_prod__,
      maxAge: 364 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({ msg: `${handle} is now a node in the CSDevGraph!` })
  }
})

// -- POST    /api/auth/login
export const login = asyncHandler(async (req, res) => {
  // 1. Get the User :
  const { handle, password } = req.body
  const user = await User.findOne({
    where: { handle },
    select: ["id", "handle", "email", "password"]
  })

  // 1+. If the User exists :
  if (user) {
    // 2. Check if the passwords match :
    if (await user.matchPasswords(password as string)) {
      // 2+. If the passwords match, create a JWT Cookie
      const id = user.id
      res.cookie("jwt", await encodeJWT({ id }), {
        httpOnly: true,
        sameSite: true,
        secure: __is_prod__,
        maxAge: 364 * 24 * 60 * 60 * 1000
      })
      res.status(201).json({ msg: `Welcome back, ${handle}!` })
      // 2-. If the passwords doesn't match, throw an exception
    } else throw new Error("Invalid Credentials!")
  } else {
    // 1-. If the user doesn't exist, throw an exception
    throw new Error(
      "There isn't any CSDevGraph account registered with that EmailID or Handle"
    )
  }
})

// -- POST    /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // 1. Check if the JWT Cookie is set & user is attached in the request object
  if (req.cookies["jwt"] && req.user) {
    // 1+. If YES, unset it and remove user from the request object
    res.cookie("jwt", "", { maxAge: 0 })
    req.user = undefined
    res.json({ msg: "Logging Out" })
    // 1-. If NO, throw an exception since the user is already logged out
  } else throw new Error("Already Logged Out")
})
