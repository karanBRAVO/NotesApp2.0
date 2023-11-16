import { userDataModel } from "../models/userData.model.js";

export const getUserNote = async (req, res) => {
  try {
    if (!req.userId) {
      const err = new Error("Bad request");
      throw err;
    }

    // getting the notes from database
    const notes = await userDataModel.find({ userId: req.userId });
    if (!notes || notes.length == 0) {
      const err = new Error("No notes found");
      throw err;
    }

    res.json({ success: true, message: "Note send to user", notes });
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

    // adding the note
    const note = new userDataModel({
      userId: req.userId,
      noteTitle,
      noteDescription,
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

    // updating note
    await userDataModel.updateOne(
      { userId: req.userId, _id: noteId },
      {
        $set: {
          noteTitle: updated_noteTitle,
          noteDescription: updated_noteDescription,
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
