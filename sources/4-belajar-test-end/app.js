const cors = require("cors");
const express = require("express");
const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { Employee } = require("./models/index");

app.post("/employees", async (req, res, next) => {
  try {
    const { name, password, address } = req.body;

    const createdEmployee = await Employee.create({
      name,
      password,
      address,
    });

    res.status(201).json({
      statusCode: 201,
      message: `Employee dengan id ${createdEmployee.id} berhasil dibuat`,
    });
  } catch (err) {
    // res.status(501).json({
    //   statusCode: 501,
    //   message: "Not Implemented",
    // });

    // mari kita coba berikan error yang tepat di bawah ini
    next(err);
  }
});

app.get("/employees", async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      statusCode: 200,
      data: employees,
    });
  } catch (err) {
    next(err);
  }
});

// error handler
app.use((err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    errorMessage = err.errors[0].message;
  }

  res.status(statusCode).json({
    statusCode,
    errorMessage,
  });
});

module.exports = app;
