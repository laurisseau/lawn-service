import express from "express";
import {forgotPassword, signin, signup, updateProfile, resetPassword, getUserById, getUsers } from "../Controller/userController.js";
import { isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.post("/signin", signin);

userRouter.post("/signup", signup);

userRouter.post("/forgotPassword", forgotPassword);

userRouter.patch("/resetPassword/:token", resetPassword);

userRouter.get("/getUserById/:id", isAuth, getUserById);

userRouter.get("/getUsers", isAuth, getUsers);

userRouter.put("/profile", isAuth, updateProfile);

export default userRouter;