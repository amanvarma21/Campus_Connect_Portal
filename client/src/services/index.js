import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT =5000;
//Middleware 
app.use(express.json());
app.use(cors());
//connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/campus_connect')
.then(() =>console.log('MongoDB connected Successfully'))
.catch((err) => console.error('MongoDB connection error:', err));
const assignmentSchema = new mongoose.Schema({
    Subject:{type:String, required:true},
    Title:{type:String, required:true},
    Status:{type:String,default:"pending"}});
const Assignment = mongoose.model('Assignment', assignmentSchema);
//1. Fetch all assignments from db 
app.get('/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// 2. POST: Create a new assignment in MongoDB (Faculty View)
app.post('/api/assignments', async (req, res) => {
  try {
    const newAssignment = await Assignment.create({
      subject: req.body.subject,
      title: req.body.title,
      status: 'Pending'
    });
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT: Submit an assignment in MongoDB (Student View)
app.put('/api/assignments/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { status: 'Submitted' },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(updatedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the Node.js HTTP Server
app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});
