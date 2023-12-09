import { authModel } from "../models/auth.model.js";
import { userDataModel } from "../models/userData.model.js";

export const getUserNote = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
      throw err;
    }

    // finding the user in the database
    const user = await authModel.findOne({ _id: req.userId });
    if (!user) {
      const error = new Error("User not found");
      throw error;
    }

    // getting the notes from database
    const notes = await userDataModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    if (!notes || notes.length == 0) {
      const err = new Error("No notes found");
      throw err;
    }

    // converting to base64
    const userData = [];
    notes.forEach((note, index) => {
      userData.push({
        _id: note._id,
        userId: note.userId,
        noteTitle: note.noteTitle.toString("base64"),
        noteDescription: note.noteDescription.toString("base64"),
        updatedAt: note.updatedAt,
      });
    });

    // sending the notes along with the userData
    res.json({ success: true, message: "Note send to user", notes: userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addUserNote = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
      throw err;
    }

    // getting the note from request
    const { noteTitle, noteDescription } = req.body;
    if (!noteTitle || !noteDescription) {
      const err = new Error("Title and description must be provided");
      throw err;
    }

    // converting to buffer
    const bin_noteTitle = Buffer.from(noteTitle, "base64");
    const bin_noteDescription = Buffer.from(noteDescription, "base64");

    // adding the note
    const note = new userDataModel({
      userId: req.userId,
      noteTitle: bin_noteTitle,
      noteDescription: bin_noteDescription,
    });
    await note.save();

    res.json({ success: true, message: "note added to database" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUserNote = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
      throw err;
    }

    // getting the note from request
    const { noteId, updated_noteTitle, updated_noteDescription } = req.body;
    if (!updated_noteTitle || !updated_noteDescription) {
      const err = new Error("Title and description must be provided");
      throw err;
    }

    // converting to buffer
    const updated_bin_noteTitle = Buffer.from(updated_noteTitle, "base64");
    const updated_bin_noteDescription = Buffer.from(
      updated_noteDescription,
      "base64"
    );

    // updating note
    await userDataModel.updateOne(
      { userId: req.userId, _id: noteId },
      {
        $set: {
          noteTitle: updated_bin_noteTitle,
          noteDescription: updated_bin_noteDescription,
        },
      }
    );

    res.json({ success: true, message: "note updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteUserNote = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
      throw err;
    }

    // getting the note from request
    const { noteId } = req.body;
    if (!noteId) {
      const err = new Error("Note id must be provided");
      throw err;
    }

    // deleting note
    await userDataModel.deleteOne({ userId: req.userId, _id: noteId });

    res.json({ success: true, message: "note deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
