const user = "georges";
const password = "georges";
const url = `mongodb+srv://${user}:${password}@cluster0.luwlu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(url);
const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(url);
    console.log("Connected to the Mongo Database");
  } catch (err) {
    console.error(err);
  }
}

connect();

module.exports = mongoose;