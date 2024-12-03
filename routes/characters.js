import { Router } from "express";
import {getImages }from '../controllers/imageController.js';
import { Allcharacters } from "../controllers/DicController.js";
import { Allexpressions } from "../controllers/Nmf.js";
const router = Router();
router.get('/Allexpressions',Allexpressions);
router.get("/Allcharacters",Allcharacters);
router.get('/getImages',getImages);
export default router;
