const mongoose = require("mongoose");
const dns = require("dns");

// Fix querySrv ECONNREFUSED on Windows where Node's c-ares DNS resolver defaults to 127.0.0.1
try {
    const servers = dns.getServers();
    if (!servers.length || servers.includes("127.0.0.1")) {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }
} catch {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;
