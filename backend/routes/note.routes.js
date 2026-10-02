const express = require("express");
const {
  listNotes,
  getNote,
  addNote,
  editNote,
  removeNote,
} = require("../controllers/note.controller");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/notes", protect, listNotes);
router.get("/notes/:id", protect, getNote);
router.post("/notes", protect, addNote);
router.put("/notes/:id", protect, editNote);
router.delete("/notes/:id", protect, removeNote);

module.exports = router;