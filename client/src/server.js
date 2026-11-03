const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

// Render provides the PORT environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});