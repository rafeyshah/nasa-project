const http = require("http");
const mongoose = require("mongoose");
const express = require("express");

const cors = require("cors");
const morgan = require("morgan");

const apiRouter = require("./routes/api");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const MONGO_URL = "mongodb://localhost:27017/nasa-project";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use("/v1", apiRouter);

exports.app = app;

// const PORT = process.env.PORT || 8000;
const PORT = 8000;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

const startServer = async () => {
  await mongoose.connect(MONGO_URL, {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
  });
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening port on ${PORT}...`);
  });
};

startServer();
