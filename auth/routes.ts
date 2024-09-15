import { Router } from "express";
import { controller } from "./controller";


export const userRoutes=Router();

userRoutes.post('/register',controller.register)
userRoutes.post('/login',controller.login)
userRoutes.post('/getUsers',controller.getUsers)