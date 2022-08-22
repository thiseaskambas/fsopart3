const mongoose = require("mongoose");

switch (process.argv.length) {
  case 2:
    console.log("please provide a password");
    process.exit();

  case 4:
    console.log("please provide a Contact Number");
    process.exit();

  default:
    console.log(`App started!`);
}

const password = process.argv[2];

const url = `mongodb+srv://thiseas:${password}@cluster0.ndply0n.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
  name: { type: String, required: [true, "contacts must have a name"] },
  number: { type: String, required: [true, "please provide number"] },
});

const Contact = mongoose.model("Contact", contactSchema);

mongoose
  .connect(url)
  .then(console.log("connected to DB"))
  .catch((err) => console.log(err));

if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  return contact
    .save()
    .then((res) => {
      console.log("contact saved : ", res);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else if (process.argv.length === 3) {
  Contact.find({})
    .then((res) => {
      console.log("Phonebook :");
      res.forEach((el) => {
        console.log(`${el.name} ${el.number}`);
      });
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  console.log(`Please provide required args`);
  process.exit();
}
