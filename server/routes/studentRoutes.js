import express from "express";

import {
  getStudents,
  getStudentById,
  getAnalytics,
  deleteStudent,
  deleteConsultation,
} from "../controllers/studentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getStudents
);

router.get(
  "/analytics",
  authMiddleware,
  getAnalytics
);

router.get(
  "/:id",
  authMiddleware,
  getStudentById
);

router.delete(
  "/:id",
  authMiddleware,
  deleteStudent
);

router.delete(
  "/consultation/:id",
  authMiddleware,
  deleteConsultation
);

export default router;