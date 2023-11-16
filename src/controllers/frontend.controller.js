export const signupUser = (req, res) => {
  try {
    res.render("signUp");
  } catch (error) {
    res.send(`<h1>Error</h1><p>${error.message}</p>`);
  }
};

export const loginUser = (req, res) => {
  try {
    res.render("logIn");
  } catch (error) {
    res.send(`<h1>Error</h1><p>${error.message}</p>`);
  }
};

export const mainPage = (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    res.send(`<h1>Error</h1><p>${error.message}</p>`);
  }
};
