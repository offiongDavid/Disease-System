import Student from "../models/Student.js";
import Consultation from "../models/Consultation.js";

// GET ALL STUDENTS
export const getStudents = async (
req,
res
) => {

try {


const students =
  await Student.find({
    user: req.user.id,
  }).sort({
    createdAt: -1,
  });

const studentsWithConsultations =
  await Promise.all(

    students.map(async (student) => {

      const consultations =
        await Consultation.find({
          student: student._id,
        }).sort({
          createdAt: -1,
        });

      return {

        ...student._doc,

        consultations,

      };

    })

  );

res.status(200).json({

  success: true,

  students: studentsWithConsultations,

});

} catch (error) {


res.status(500).json({
  message: error.message,
});


}

};

// GET SINGLE STUDENT
export const getStudentById = async (
req,
res
) => {

try {

```
const student =
  await Student.findOne({

    _id: req.params.id,

    user: req.user.id,

  });

const consultations =
  await Consultation.find({
    student: req.params.id,
  }).sort({
    createdAt: -1,
  });

res.status(200).json({

  student,

  consultations,

});
```

} catch (error) {

```
res.status(500).json({
  message: error.message,
});
```

}

};

// ANALYTICS
export const getAnalytics = async (
req,
res
) => {

try {

```
const totalStudents =
  await Student.countDocuments({
    user: req.user.id,
  });

const totalConsultations =
  await Consultation.countDocuments();

const userStudents =
  await Student.find({
    user: req.user.id,
  });

const studentIds =
  userStudents.map(
    (student) => student._id
  );

const consultations =
  await Consultation.find({
    student: {
      $in: studentIds,
    },
  });

const diseaseStats = {};

consultations.forEach(
  (consultation) => {

    const disease =
      consultation.predictedDisease;

    if (
      diseaseStats[disease]
    ) {

      diseaseStats[disease]++;

    } else {

      diseaseStats[disease] = 1;

    }

  }
);

res.status(200).json({

  totalStudents,

  totalConsultations,

  diseaseStats,

});
```

} catch (error) {

```
res.status(500).json({
  message: error.message,
});
```

}

};

// DELETE STUDENT
export const deleteStudent = async (
  req,
  res
) => {

  try {

    const student =
      await Student.findOne({

        _id: req.params.id,

        user: req.user.id,

      });

    if (!student) {

      return res.status(404).json({
        message: "Student not found",
      });

    }

    // DELETE CONSULTATIONS
    await Consultation.deleteMany({
      student: student._id,
    });

    // DELETE STUDENT
    await Student.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Student deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE CONSULTATION
export const deleteConsultation =
  async (req, res) => {

    try {

      const consultation =
        await Consultation.findById(
          req.params.id
        );

      if (!consultation) {

        return res.status(404).json({
          message:
            "Consultation not found",
        });

      }

      // CHECK IF STUDENT BELONGS TO USER
      const student =
        await Student.findOne({

          _id:
            consultation.student,

          user: req.user.id,

        });

      if (!student) {

        return res.status(403).json({
          message: "Unauthorized",
        });

      }

      await Consultation.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Consultation deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  };