const signUpBtn = document.getElementById("signUpBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const notifier = document.getElementById("notifier");
const loginbtn = document.getElementById("loginbtn");

const sendNotification = (msg, color, delay) => {
  notifier.style.display = "flex";
  notifier.innerHTML = `<p style="background-color: ${color}" class="notification">${msg}</p>`;

  setTimeout(() => {
    notifier.style.display = "none";
  }, delay);
};

const clearValues = () => {
  username.value = "";
  password.value = "";
};

const generateKeyPairs = async () => {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // 2048-bit key size
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: "SHA-256" },
      },
      true, // Can extract the private key
      ["encrypt", "decrypt"]
    );

    return keyPair;
  } catch (error) {
    console.error("Key pair generation failed:", error);
    throw new Error("Key pair generation failed");
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

signUpBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  signUpBtn.style.backgroundColor = "#3498db61";
  signUpBtn.disabled = true;

  if (username.value.length > 0 && password.value.length > 0) {
    try {
      const keyPairs = await generateKeyPairs();

      const publicKey = await crypto.subtle.exportKey(
        "spki",
        keyPairs.publicKey
      );
      const base64publickey = arrayBufferToBase64(publicKey);

      const privateKey = await crypto.subtle.exportKey(
        "pkcs8",
        keyPairs.privateKey
      );
      const base64privatekey = arrayBufferToBase64(privateKey);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          publicKey: base64publickey,
        }),
      });
      const data = await res.json();

      if (data.success) {
        sendNotification(data.message, "green", 5000);

        // storing the private key in local storage
        localStorage.clear();
        localStorage.setItem("privateKey", base64privatekey);

        setTimeout(() => {
          loginbtn.click();
        }, 1000);
      } else {
        sendNotification(data.message, "red", 5000);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    sendNotification("Username and password are required", "red", 5000);
  }

  signUpBtn.style.backgroundColor = "#3498db";
  signUpBtn.disabled = false;
  clearValues();
});
