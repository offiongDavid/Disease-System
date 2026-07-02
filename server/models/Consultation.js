import mongoose from "mongoose";

const consultationSchema =
  new mongoose.Schema(

    {

      // OWNER OF THE CONSULTATION
      user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      // STUDENT
      student: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Student",

        required: true,

      },

      // SYMPTOMS
      symptoms: [

        {

          type: String,

        },

      ],

      // PREDICTION
      predictedDisease: {

        type: String,

        default: "Unknown",

      },

      // CONFIDENCE
      confidence: {

        type: String,

        default: "Low",

      },

      // MEDICATION
      medication: {

        type: String,

        default: "No medication provided",

      },

      // RECOMMENDATION
      recommendation: {

        type: String,

        default: "No recommendation provided",

      },

      // PRECAUTIONS
      precautions: {

        type: String,

        default: "No precautions provided",

      },

    },

    {

      timestamps: true,

    }

  );

export default mongoose.model(
  "Consultation",
  consultationSchema
);