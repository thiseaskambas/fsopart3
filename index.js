const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("postbody", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postbody"
  )
);

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
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = phonebook.find((el) => el.id === id);
  if (!found) {
    return res.status(404).send("person not found");
  }
  res.status(201).json(found);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = phonebook.find((el) => el.id === id);
  if (!found) {
    res.status(404).send("person not found");
  }
  phonebook = phonebook.filter((el) => el.id !== id);
  res.status(200).json({ message: "deleted!" });
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

  const alreadyExistingName = phonebook.find(
    (el) => el.name.toLowerCase() === req.body.name.toLowerCase()
  );

  if (alreadyExistingName) {
    return res.status(400).json({ error: "person already exists" });
  }

  const newPerson = {
    id:
      phonebook.length > 0 ? Math.max(...phonebook.map((el) => el.id)) + 1 : 1,
    name: req.body.name,
    number: req.body.number,
  };
  phonebook = [...phonebook, newPerson];
  res.status(201).json(newPerson);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Phonebook app listening on port ${PORT}`);
});
