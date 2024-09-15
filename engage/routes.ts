import { Router } from "express";
import { controller } from "./controller";


export const engageRoutes=Router();

engageRoutes.post('/addGroup',controller.addGroup)
engageRoutes.post('/getGroups',controller.getGroups)
engageRoutes.post('/getTasks',controller.getTasks)
engageRoutes.post('/createTasks',controller.createTask)
engageRoutes.post('/markComplete',controller.markComplete)