const launchesDatabase = require("./launches.mongo");

const launches = new Map();

let latestFlightNumber = 100;

const saveLaunch = async (launch) => {
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);
launches.set(launch.flightNumber, launch);
// launches.set(launch);

const existsLaunchWithId = (launchId) => {
  return launches.has(launchId);
};

const abortLaunchById = (launchId) => {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
};

const getAllLaunches = async () => {
  // console.log(Array.from(launches.values()));
  return await launchesDatabase.find(
    {}
    // Excluding Field from Response
    // {
    //   _id: 0,
    //   __v: 0,
    // }
  );
};

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["Zero to Mastery", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
};

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
