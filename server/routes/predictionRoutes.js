import express from "express";

import {
  createConsultation,
} from "../controllers/predictionController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createConsultation
);

export default router;