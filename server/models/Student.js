import mongoose from "mongoose";

const studentSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      matricNumber: {
        type: String,
        required: true,
      },

      department: {
        type: String,
        required: true,
      },

      level: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Student = mongoose.model(
  "Student",
  studentSchema
);

export default Student;