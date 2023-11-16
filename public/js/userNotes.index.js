const addNewNoteContainerShowBtn = document.getElementById(
  "addNewNoteContainerShowBtn"
);
const addNoteDiv = document.getElementById("addNoteDiv");
const crossSign = document.getElementById("crossSign");
const notifier = document.getElementById("notifier");
const addNoteBtn = document.getElementById("addNoteBtn");
const titleInput = document.getElementById("note_title");
const descriptionInput = document.getElementById("userNote");
const mainInnerCont = document.getElementById("mainInnerCont");
const hiddenLayer = document.getElementById("hiddenLayer");
const modifyNoteDiv = document.getElementById("modifyNoteDiv");
const modify_crossSign = document.getElementById("modify_crossSign");
const modify_note_title = document.getElementById("modify_note_title");
const modify_userNote = document.getElementById("modify_userNote");
const modifyNoteBtn = document.getElementById("modifyNoteBtn");
const closeProfile = document.getElementById("closeProfile");
const showProfileDiv = document.getElementById("showProfileDiv");
const showProfileBtn = document.getElementById("showProfileBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const logoutBtn = document.getElementById("logoutBtn");

// close the profile page
closeProfile.addEventListener("click", () => {
  showProfileDiv.style.display = "none";
});

showProfileBtn.addEventListener("click", () => {
  showProfileDiv.style.display = "flex";
});

// logging out
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  document.cookie = `token=""; path=/`;
  window.location.href = "/notesapp2_0/login";
});

// deleting the account
deleteAccountBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/auth/delete-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      sendNotification(data.message, "green", 5000);
      logoutBtn.click();
      location.href = "/notesapp2_0/signup";
    } else {
      sendNotification(data.message, "red", 5000);
    }
  } catch (error) {
    console.error(error);
  }
});

const sendNotification = (msg, color, delay) => {
  notifier.style.display = "flex";
  notifier.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `<p style="background-color: ${color}" class="notification">${msg}</p>`;
  notifier.append(div);

  setTimeout(() => {
    notifier.style.display = "none";
  }, delay);
};

const getUserNotes = async () => {
  try {
    const res = await fetch("/api/get-user-note", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      return data.notes;
    } else {
      if (String(data.message).toLowerCase() !== "no notes found") {
        window.location.href = "/notesapp2_0/login";
      }
      sendNotification(data.message, "red", 5000);
    }
  } catch (error) {
    console.error(error);
  }
  return [];
};

const addUserNote = async (title, desc) => {
  try {
    const res = await fetch("/api/add-user-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ noteTitle: title, noteDescription: desc }),
    });
    const data = await res.json();
    if (data.success) {
      sendNotification(data.message, "green", 5000);
      return true;
    } else {
      sendNotification(data.message, "red", 5000);
    }
  } catch (error) {
    console.error(error);
  }
  return false;
};

const updateUserNote = async (id, title, desc) => {
  try {
    const res = await fetch("/api/update-user-note", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        noteId: id,
        updated_noteTitle: title,
        updated_noteDescription: desc,
      }),
    });
    const data = await res.json();
    if (data.success) {
      sendNotification(data.message, "green", 5000);
    } else {
      sendNotification(data.message, "red", 5000);
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteUserNote = async (id) => {
  try {
    const res = await fetch("/api/delete-user-note", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ noteId: id }),
    });
    const data = await res.json();
    if (data.success) {
      sendNotification(data.message, "green", 5000);
    } else {
      sendNotification(data.message, "red", 5000);
    }
  } catch (error) {
    console.error(error);
  }
};

// empty the note title and desc in container
const clearNote = () => {
  titleInput.value = "";
  descriptionInput.value = "";
};

// show the add note container
addNewNoteContainerShowBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addNoteDiv.style.display = "flex";
  clearNote();
  hiddenLayer.click();
  closeProfile.click();
});

// close the add note container
crossSign.addEventListener("click", (e) => {
  e.preventDefault();
  addNoteDiv.style.display = "none";
  clearNote();
  hiddenLayer.click();
});

// adding a new note
addNoteBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const desc = descriptionInput.value;

  if (title.length > 0 && desc.length > 0) {
    const res = await addUserNote(title, desc);
    if (res) {
      crossSign.click();
      rePopulateNotes();
    }
    clearNote();
  } else {
    sendNotification("Title and description are required", "skyblue", 5000);
  }
});

// get the boxes template
const getNotesBoxes = (title, desc, time, note_id) => {
  return `
    <div class="noteCont">
      <div class="options">
        <div class="dateCreatedCont">
          <div class="spanContDate">
            <span>${time}</span>
          </div>
        </div>
        
        <div class="optionsLinksCont" id="${note_id}">
          <button
            class="mainoptionCont"
            onclick="showModifyNotes('${note_id}', '${title}', '${desc}')"
          >
            <img src="../assets/img/edit.svg" alt="edit" draggable="false" />
            <div class="spanOption">
              <span class="userSelectNone">Edit</span>
            </div>
          </button>
  
          <button class="mainoptionCont" type="button" onclick="handleDeleteNoteClick('${note_id}')">
              <img
              src="../assets/img/delete.svg"
              alt="delete"
              draggable="false"
              class="optionsIcon"
              />
              <div class="spanOption">
              <span class="userSelectNone">Delete</span>
              </div>
          </button>
        </div>
        
        <div
          class="optionsCont"
          onclick="showOptionsContainer('${String(note_id)}')"
        >
          <span class="userSelectNone">...</span>
        </div>
      </div>
  
      <div class="noteHeading">
        <span>${title}</span>
      </div>
      <div class="note">
        <span>${desc}</span>
      </div>
    </div>`;
};

// show options container
let optionContainerId = undefined;
const showOptionsContainer = (id) => {
  optionContainerId = id;
  document.getElementById(id).style.display = "block";
  hiddenLayer.style.display = "flex";
};

hiddenLayer.addEventListener("click", () => {
  hiddenLayer.style.display = "none";
  if (optionContainerId) {
    document.getElementById(optionContainerId).style.display = "none";
  }
});

// close modify container
modify_crossSign.addEventListener("click", () => {
  modifyNoteDiv.style.display = "none";
  modify_note_title.value = "";
  modify_userNote.value = "";
});

// show modify container
let modifiedData_old = {
  modify_noteId: undefined,
  modify_noteTitle: undefined,
  modify_noteDesc: undefined,
};
const showModifyNotes = (id, title, desc) => {
  modifiedData_old.modify_noteId = id;
  modifiedData_old.modify_noteTitle = title;
  modifiedData_old.modify_noteDesc = desc;
  hiddenLayer.click();
  modifyNoteDiv.style.display = "flex";

  modify_note_title.value = title;
  modify_userNote.value = desc;
};

// update the note
modifyNoteBtn.addEventListener("click", () => {
  if (
    modify_note_title.value != modifiedData_old.modify_noteTitle ||
    modify_userNote.value != modifiedData_old.modify_noteDesc
  ) {
    updateUserNote(
      modifiedData_old.modify_noteId,
      modify_note_title.value,
      modify_userNote.value
    );
    modify_crossSign.click();
    rePopulateNotes();
  } else {
    sendNotification("make some changes", "skyblue", 5000);
  }
});

// deleting the note
const handleDeleteNoteClick = (id) => {
  hiddenLayer.click();
  if (confirm("Are you sure you want to delete")) {
    deleteUserNote(id);
    rePopulateNotes();
  }
};

// re-populate the notes
const rePopulateNotes = () => {
  mainInnerCont.innerHTML = "";
  showNotes();
};

// populates the contianer with notes
const showNotes = async () => {
  const notes = await getUserNotes();
  notes.forEach((note) => {
    const noteBox = document.createElement("div");
    noteBox.innerHTML = getNotesBoxes(
      note.noteTitle,
      note.noteDescription,
      note.updatedAt,
      note._id,
      note.userId
    );
    mainInnerCont.appendChild(noteBox);
  });
};
showNotes();
