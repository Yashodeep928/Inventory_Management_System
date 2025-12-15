import express from "express";
import { getMonthlyRevenue } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/monthly-revenue", getMonthlyRevenue);

export default router;
