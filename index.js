const express = require("express");
const cors = require("cors");
const app = express();
const Contact = require("./models/contact");
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/api/persons", (req, res, next) => {
  Contact.find({})
    .then((contacts) => {
      res.json(contacts);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((found) => {
      if (found) {
        res.json(found);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
      console.log("deleted!");
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  Contact.findByIdAndUpdate(
    req.params.id,
    { number: req.body.number },
    { new: true }
  )
    .then((updatedContact) => {
      console.log(updatedContact);
      res.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Contact.countDocuments({}).then((count) => {
    res.send(`Phonebook has info for ${count} people.
    ${new Date()}
    `);
  });
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name.trim() || !req.body.number.trim()) {
    return res.status(400).json({ error: "name or number missing" });
  }
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
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error("from error handler  :  ", error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Phonebook app listening on port ${PORT}`);
});
