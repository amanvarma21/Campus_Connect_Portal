import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas (fall back to local if testing locally)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_connect';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ... (your schema, model, and routes remain the same) ...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
