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
  // localStorage.removeItem("token");
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

const encryptData = async (data, key) => {
  const enc = new TextEncoder();

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    enc.encode(data)
  );

  return encrypted;
};

const decryptData = async (data, key) => {
  try {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      key,
      data
    );

    const dec = new TextDecoder();
    const decryptedText = dec.decode(new Uint8Array(decrypted));

    return decryptedText;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64 = (buffer) => {
  const binary = new Uint8Array(buffer);
  return btoa(String.fromCharCode.apply(null, binary));
};

const importKey = (data) => {
  return window.crypto.subtle.importKey(
    "spki",
    data,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );
};

const importPrivateKey = (data) => {
  return window.crypto.subtle.importKey(
    "pkcs8",
    data,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
};

const getPublicKey = async () => {
  try {
    const res = await fetch("/api/get-user-public-key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success) {
      return data.publicKey;
    } else {
      if (String(data.message).toLowerCase() !== "no notes found") {
        window.location.href = "/notesapp2_0/login";
      }
      sendNotification(data.message, "red", 5000);
    }
  } catch (error) {
    console.error(error);
  }
  return "";
};

const getLocaleTime = (utcTimeString) => {
  const utcDate = new Date(utcTimeString);

  const localTimeString = utcDate.toLocaleString();
  return localTimeString;
};

const getUserNotes = async () => {
  try {
    const res = await fetch("/api/get-user-note", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

const getEncryptedData = async (data) => {
  try {
    // get the public key
    const publicKey = await getPublicKey();
    const publicKey_buffer = base64ToArrayBuffer(publicKey);
    const key = await importKey(publicKey_buffer);

    const enc_data = arrayBufferToBase64(await encryptData(data, key));

    return enc_data;
  } catch (e) {
    throw e;
  }
};

const getDecryptedData = async (enc_data) => {
  try {
    // get the private key
    const privateKey = localStorage.getItem("privateKey");
    const privateKey_buffer = base64ToArrayBuffer(privateKey);
    const private_key = await importPrivateKey(privateKey_buffer);
    const dec_data = await decryptData(
      base64ToArrayBuffer(enc_data),
      private_key
    );

    return dec_data;
  } catch (error) {
    throw error;
  }
};

// adding a new note
addNoteBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const desc = descriptionInput.value;

  if (title.length > 0 && desc.length > 0) {
    try {
      // encrypt the note
      const enc_title = await getEncryptedData(title);
      const enc_desc = await getEncryptedData(desc);

      // submit the note
      const res = await addUserNote(enc_title, enc_desc);
      if (res) {
        crossSign.click();
        rePopulateNotes();
      }
      clearNote();
    } catch (error) {
      sendNotification("Error", "red", 1000);
    }
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
modifyNoteBtn.addEventListener("click", async () => {
  if (
    modify_note_title.value != modifiedData_old.modify_noteTitle ||
    modify_userNote.value != modifiedData_old.modify_noteDesc
  ) {
    try {
      // encrypt the updated note
      const enc_modify_title = await getEncryptedData(modify_note_title.value);
      const enc_modify_desc = await getEncryptedData(modify_userNote.value);

      updateUserNote(
        modifiedData_old.modify_noteId,
        enc_modify_title,
        enc_modify_desc
      );
      modify_crossSign.click();
      rePopulateNotes();
    } catch (e) {
      sendNotification("Error Modifying", "red", 5000);
    }
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

  notes.forEach(async (note) => {
    try {
      // decrypt the note
      const dec_note_title = await getDecryptedData(note.noteTitle);
      const dec_note_desc = await getDecryptedData(note.noteDescription);

      const noteBox = document.createElement("div");
      noteBox.innerHTML = getNotesBoxes(
        dec_note_title,
        dec_note_desc,
        getLocaleTime(note.updatedAt),
        note._id,
        note.userId
      );
      mainInnerCont.appendChild(noteBox);
    } catch (error) {
      sendNotification(
        "Error populating notes | Private Key not found",
        "red",
        5000
      );
    }
  });
};
showNotes();
