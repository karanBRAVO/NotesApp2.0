const logInBtn = document.getElementById("logInBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const notifier = document.getElementById("notifier");
const signupbtn = document.getElementById("signupbtn");

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

logInBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  logInBtn.style.backgroundColor = "#3498db61";
  logInBtn.disabled = true;

  if (username.value.length > 0 && password.value.length > 0) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
      const data = await res.json();

      if (data.success) {
        sendNotification(data.message, "green", 5000);
        const token = data.token;
        localStorage.setItem("token", token);
        window.location.href = "/notesapp2_0/notes";
      } else {
        sendNotification(data.message, "red", 5000);
        if (String(data.message).toLowerCase() == "user not found") {
          setTimeout(() => {
            signupbtn.click();
          }, 5000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    sendNotification("Username and password are required", "red", 5000);
  }

  logInBtn.style.backgroundColor = "#3498db";
  logInBtn.disabled = false;
  clearValues();
});
