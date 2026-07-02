import Student from "../models/Student.js";
import Consultation from "../models/Consultation.js";
import { aiPrediction } from "./aiController.js";

import diseaseRules from "../utils/diseaseRules.js";

export const createConsultation = async (
  req,
  res
) => {

  try {

    const {
      name,
      matricNumber,
      department,
      level,
      symptoms,
    } = req.body;



    const userId = req.user.id;
    let student = await Student.findOne({
      matricNumber,
      user: userId,
    });

    if (!student) {

      student = await Student.create({

        name,

        matricNumber,

        department,

        level,

        user: userId,

      });

    }

   
    let predictedDisease = "Unknown";

    for (const rule of diseaseRules) {

      const matchedSymptoms =
        rule.symptoms.filter((symptom) =>
          symptoms.includes(symptom)
        );

      if (matchedSymptoms.length >= 2) {

        predictedDisease =
          rule.disease;

        break;

      }

    }

    const aiResponse =
      await aiPrediction(
        symptoms,
        predictedDisease
      );
    const consultation =
      await Consultation.create({

        user: userId,

        student: student._id,

        symptoms,

        predictedDisease:
          aiResponse?.predictedDisease ||
          predictedDisease,

        confidence:
          aiResponse?.confidence,

        medication:
          aiResponse?.medication,

        recommendation:
          aiResponse?.recommendation,

        precautions:
          aiResponse?.precautions,

      });
    res.status(201).json({

      success: true,

      consultation,

      predictedDisease:
        aiResponse?.predictedDisease ||
        predictedDisease,

      aiAnalysis: aiResponse,

    });

  } catch (error) {

    console.log(
      "PREDICTION ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });

  }

};