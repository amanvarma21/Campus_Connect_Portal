
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const assignmentRoutes = require("./routes/assignmentRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://campus-connect-frontend-gtyt.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
});

// API routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/auth", authRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Campus Connect API is running"
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    const status = err.status ||
        (err.name === "ValidationError" ? 400 : 500);

    res.status(status).json({
        success: false,
        error: {
            status,
            message: err.message || "Internal Server Error"
        }
    });
});

// Start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
};

module.exports = { app, startServer };
