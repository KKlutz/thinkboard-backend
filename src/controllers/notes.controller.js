import notes from "../models/note.model.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

// All notes controller functions
export const getAllNotes = async (req, res) => {
  const { sorted = "updatedAt", order = "desc", limit = 6, page = 1 } = req.query;
  const orderBy = order === "asc" ? 1 : -1;
  const noteLimit = parseInt(limit);
  const skipNote = (parseInt(page) - 1) * noteLimit;

  try {
    const getNotes = await notes
      .find()
      .sort({ [sorted]: orderBy })
      .limit(noteLimit)
      .skip(skipNote);

    const count = await notes.countDocuments();
    console.log("Fetched all notes successfully.");
    res.status(200).json({
      message: `${getNotes.length} notes fetched.`,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / noteLimit),
      notesCount: count,
      notes: getNotes,
    });
  } catch (error) {
    console.error("Error get all notes: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const getNote = await notes.findById(id);

    if (!getNote) return res.status(404).json({ message: "Note was not found." });

    console.log("Fetched note by id successfully.");
    res.status(200).json({ message: "Note fetched by id.", note: getNote });
  } catch (error) {
    console.error("Error get note by id: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    // 1st method: using the model directly
    // const addNote = await notes.create(req.body);

    // 2nd method: using the model destructor
    const { title, content } = req.body;
    const new_note = new notes({ title, content });
    const note = await new_note.save();

    console.log("Note created successfully.");
    res.status(201).json(note);
  } catch (error) {
    console.error("Error create a note: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content } = req.body;
    const latestNote = await notes.findByIdAndUpdate(id, { title, content }, { new: true });

    if (!latestNote) return res.status(404).json({ message: "Note was not found." });

    console.log("Note updated successfully.");
    res.status(200).json({ message: `note with id: ${id} updated.`, updated: latestNote });
  } catch (error) {
    console.error("Error update a note: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await notes.findByIdAndDelete(id);

    if (!deletedNote) return res.status(404).json({ message: "Note was not found." });

    console.log("Note deleted successfully.");
    res.status(200).json({ message: `note with id: ${id} deleted.`, deleted: deletedNote });
  } catch (error) {
    console.error("Error delete a note: ", error);
    res.status(500).json({ message: error.message });
  }
};
