import mongoose from "mongoose";

const connectToDB = (uri) => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to database", `${uri}`);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
};

export default connectToDB;
