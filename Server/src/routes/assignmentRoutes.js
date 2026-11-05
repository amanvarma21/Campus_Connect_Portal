const express = require('express');
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const router = express.Router();

const toClientAssignment = (assignment) => ({
  id: assignment._id.toString(),
  subject: assignment.subject,
  title: assignment.title,
  status: assignment.status,
  dueDate: assignment.dueDate
});

router.get('/', async (req, res) => {
  const assignments = await Assignment.find().sort({ _id: 1 });
  res.status(200).json(assignments.map(toClientAssignment));
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid assignment ID' });
  }

  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  return res.status(200).json(toClientAssignment(assignment));
});

router.post('/', async (req, res) => {
  const { subject, title, dueDate } = req.body;

  if (!subject || !title || !dueDate) {
    return res.status(400).json({
      message: 'Please provide subject, title, and dueDate.'
    });
  }

  const assignment = await Assignment.create({
    subject,
    title,
    status: 'Pending',
    dueDate
  });

  return res.status(201).json(toClientAssignment(assignment));
});

router.put('/:id/submit', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid assignment ID' });
  }

  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    { status: 'Submitted' },
    { new: true, runValidators: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  return res.status(200).json(toClientAssignment(assignment));
});

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid assignment ID' });
  }

  const updates = {};
  for (const field of ['subject', 'title', 'dueDate', 'status']) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  return res.status(200).json(toClientAssignment(assignment));
});

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid assignment ID' });
  }

  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  if (!assignment) {
    return res.status(404).json({ message: 'Assignment not found' });
  }

  return res.status(200).json({
    message: 'Assignment deleted successfully',
    assignment: toClientAssignment(assignment)
  });
});

module.exports = router;