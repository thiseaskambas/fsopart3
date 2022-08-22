const express = require("express");
const cors = require("cors");
const app = express();
const Contact = require("./models/contact");
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Contact.find({})
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((err) => console.log(err));
});

app.get("/api/persons/:id", (req, res) => {
  Contact.findById(req.params.id)
    .then((found) => {
      res.json(found);
    })
    .catch((err) => console.log(err));
});

app.delete("/api/persons/:id", (req, res) => {
  Contact.findByIdAndDelete(req.params.id).then(() => {
    console.log("deleted!");
  });
});

app.get("/info", (req, res) => {
  res.send(`Phonebook has info for ${phonebook.length} people.
   ${new Date()}
   `);
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name.trim() || !req.body.number.trim()) {
    return res.status(400).json({ error: "name or number missing" });
  }
  // const alreadyExistingName = phonebook.find(
  //   (el) => el.name.toLowerCase() === req.body.name.toLowerCase()
  // );

  // if (alreadyExistingName) {
  //   return res.status(400).json({ error: "person already exists" });
  // }
  const newContact = new Contact({
    name: req.body.name,
    number: req.body.number,
  });
  newContact
    .save()
    .then((result) => {
      console.log("contact saved : ", result);
      res.json(result);
    })
    .catch((err) => console.log(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Phonebook app listening on port ${PORT}`);
});
