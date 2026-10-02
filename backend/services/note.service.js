const Note = require("../models/note.model");

const getAllNotes = async (userId) => {
  return Note.find({ userId }).sort({ updatedAt: -1 });
};

const getNoteById = async (id, userId) => {
  return Note.findOne({ _id: id, userId });
};

const createNote = async ({ userId, title, content }) => {
  return Note.create({ userId, title, content });
};

const updateNote = async (id, userId, { title, content }) => {
  return Note.findOneAndUpdate(
    { _id: id, userId },
    { title, content },
    { new: true } // return the updated document, not the original
  );
};

const deleteNote = async (id, userId) => {
  return Note.findOneAndDelete({ _id: id, userId });
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};