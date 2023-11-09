const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const { loadPlanetsData } = require("./models/planets.model");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(planetsRouter);
app.use(launchesRouter);

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening port on ${PORT}...`);
  });
};

startServer();
