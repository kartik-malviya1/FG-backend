import { Router } from "express";
import { userRouter } from "./user";
import adminRouter from "./admin";
import { bookRouter } from "./book";
import chatRouter from "./chat";

export const router = Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/books", bookRouter);
router.use("/chat", chatRouter);

