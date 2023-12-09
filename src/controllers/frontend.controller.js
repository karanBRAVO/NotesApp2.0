export const signupUser = (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const error = new Error(
        `<ul><li>Make sure you are logged out</li><li>Try clearing cookies</li></ul>`
      );
      throw error;
    }
    res.render("signUp");
  } catch (error) {
    res.send(`<h1>Error</h1><p>${error.message}</p>`);
  }
};

export const loginUser = (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const error = new Error(
        `<ul><li>Make sure you are logged out</li><li>Try clearing cookies</li></ul>`
      );
      throw error;
    }
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

export const homePage = (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    res.send(`<h1>Error</h1><p>${error.message}</p>`);
  }
};
