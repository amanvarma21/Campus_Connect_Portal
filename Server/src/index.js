const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Custom Middleware: Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request to ${req.url}`);
  next();
});

let assignments = [
  { id: 1, subject: 'CS3301 - Full Stack', title: 'Lab 2: React Routing', status: 'Pending', dueDate: 'Sept 15, 2026' },
  { id: 2, subject: 'CS3302 - DBMS', title: 'ER Diagram Report', status: 'Submitted', dueDate: 'Sept 01, 2026' }
];

// 1. READ ALL (GET)
app.get('/api/assignments', (req, res) => {
  res.json(assignments);
});

// 2. READ ONE BY ID (GET)
app.get('/api/assignments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const assignment = assignments.find(a => a.id === id);

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  res.json(assignment);
});

// 3. CREATE (POST)
app.post('/api/assignments', (req, res) => {
  const newAssignment = {
    id: assignments.length ? Math.max(...assignments.map(a => a.id)) + 1 : 1,
    subject: req.body.subject || 'CS3301 - Full Stack',
    title: req.body.title || 'Untitled Assignment',
    status: req.body.status || 'Pending',
    dueDate: req.body.dueDate || 'TBD'
  };
  assignments.push(newAssignment);
  res.status(201).json(newAssignment);
});

// 4. UPDATE (PUT)
app.put('/api/assignments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const assignment = assignments.find(a => a.id === id);

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  if (req.body.subject !== undefined) assignment.subject = req.body.subject;
  if (req.body.title !== undefined) assignment.title = req.body.title;
  if (req.body.status !== undefined) assignment.status = req.body.status;
  if (req.body.dueDate !== undefined) assignment.dueDate = req.body.dueDate;

  res.json(assignment);
});

// 4b. SUBMIT ASSIGNMENT (PUT - Used by Frontend)
app.put('/api/assignments/:id/submit', (req, res) => {
  const id = parseInt(req.params.id);
  const assignment = assignments.find(a => a.id === id);

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  assignment.status = 'Submitted';
  res.json(assignment);
});

// 5. DELETE (DELETE)
app.delete('/api/assignments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = assignments.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  const deleted = assignments.splice(index, 1);
  res.json({ message: 'Assignment deleted successfully', assignment: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Node server is running on http://localhost:${PORT}`);
});