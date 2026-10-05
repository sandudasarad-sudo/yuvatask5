require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const students = [];

app.get("/", (req, res) => {
    res.json({
        message: "YuvaTask5 Backend API is running",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.post("/api/students", (req, res, next) => {
    try {
        const { name, email, age, course } = req.body;

        if (!name || !email || !age || !course) {
            return res.status(400).json({
                success: false,
                message: "Name, email, age and course are required"
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        if (age < 16 || age > 100) {
            return res.status(400).json({
                success: false,
                message: "Age must be between 16 and 100"
            });
        }

        const existingStudent = students.find(
            student => student.email.toLowerCase() === email.toLowerCase()
        );

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Student with this email already exists"
            });
        }

        const student = {
            id: students.length + 1,
            name,
            email,
            age,
            course,
            createdAt: new Date().toISOString()
        };

        students.push(student);

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student
        });

    } catch (error) {
        next(error);
    }
});

app.get("/api/students", (req, res) => {
    res.status(200).json({
        success: true,
        count: students.length,
        students
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});