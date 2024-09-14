import { Router } from "express";
import { controller } from "./controller";


export const userRoutes=Router();

userRoutes.post('/addGroup',controller.addGroup)
// userRoutes.post('/login',controller.login)