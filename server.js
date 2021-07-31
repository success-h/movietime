const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const users = require("./routes/api/users");
const movies = require("./routes/api/movies");
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Enable Cross Origin Resource Sharing
app.use(cors());

// Use Routes
app.use("/api/users", users);
app.use("/api/movies", movies);

// Server static assets if in production
const dev = process.env.NODE_ENV !== "production"
if (!dev) {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
