import { Router } from "express";

import { Allcharacters } from "../controllers/DicController.js";
const router = Router();
router.get("/Allcharacters",Allcharacters);

export default router;
