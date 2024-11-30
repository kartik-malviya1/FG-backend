import { Router } from "express";

export const userRouter = Router()

userRouter.get('/', (req, res)=>{
  res.json({
    message: "This is user router"
  })
} )