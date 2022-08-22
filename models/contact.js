const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_URL;

mongoose
  .connect(url)
  .then(console.log("connected to DB"))
  .catch((err) => console.log(err));

const contactSchema = new mongoose.Schema({
  name: { type: String, required: [true, "contacts must have a name"] },
  number: { type: String, required: [true, "please provide number"] },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
