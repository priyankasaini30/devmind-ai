const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../services/note.service");

const listNotes = asyncHandler(async (req, res) => {
  const notes = await getAllNotes(req.user.id);
  res.status(200).json(notes);
});

const getNote = asyncHandler(async (req, res) => {
  const note = await getNoteById(req.params.id, req.user.id);
  if (!note) throw new AppError("Note not found", 404);
  res.status(200).json(note);
});

const addNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !title.trim()) throw new AppError("Title is required", 400);
  if (!content || !content.trim()) throw new AppError("Content is required", 400);

  const note = await createNote({ userId: req.user.id, title, content });
  res.status(201).json(note);
});

const editNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !title.trim()) throw new AppError("Title is required", 400);
  if (!content || !content.trim()) throw new AppError("Content is required", 400);

  const note = await updateNote(req.params.id, req.user.id, { title, content });
  if (!note) throw new AppError("Note not found", 404);
  res.status(200).json(note);
});

const removeNote = asyncHandler(async (req, res) => {
  const note = await deleteNote(req.params.id, req.user.id);
  if (!note) throw new AppError("Note not found", 404);
  res.status(200).json({ message: "Note deleted" });
});

module.exports = {
  listNotes,
  getNote,
  addNote,
  editNote,
  removeNote,
};