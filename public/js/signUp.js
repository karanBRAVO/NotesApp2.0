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
}

signUpBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  signUpBtn.style.backgroundColor = "#3498db61";
  signUpBtn.disabled = true;

  if (username.value.length > 0 && password.value.length > 0) {
    try {
      const res = await fetch("/api/auth/signup", {
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
        setTimeout(() => {
          loginbtn.click();
        }, 5000);
      } else {
        sendNotification(data.message, "red", 5000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  signUpBtn.style.backgroundColor = "#3498db";
  signUpBtn.disabled = false;
  clearValues();
});
