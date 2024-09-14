import { Router } from "express";
import { controller } from "./controller";


export const engageRoutes=Router();

engageRoutes.post('/addGroup',controller.addGroup)
engageRoutes.post('/getGroups',controller.getGroups)
// userRoutes.post('/login',controller.login)