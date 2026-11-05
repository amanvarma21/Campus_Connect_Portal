
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Assignment from "./models/assignments.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

// API test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "Express backend connected successfully!"
    });
});

const PORT = process.env.PORT || 5000;


// 1. GET: Fetch all assignments
app.get("/api/assignments", async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. POST: Create a new assignment
app.post("/api/assignments", async (req, res) => {
    try {
        const { subject, title, dueDate } = req.body;

        const newAssignment = await Assignment.create({
            subject,
            title,
            dueDate,
            status: "Pending"
        });

        res.status(201).json(newAssignment);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 3. PUT: Mark assignment as submitted
app.put("/api/assignments/:id/submit", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid assignment ID"
            });
        }

        const updatedAssignment =
            await Assignment.findByIdAndUpdate(
                id,
                { status: "Submitted" },
                { new: true, runValidators: true }
            );

        if (!updatedAssignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.json(updatedAssignment);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
