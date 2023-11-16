const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planetsDatabase = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();

const saveLaunch = async (launch) => {
  // Referential Integrity -- Node Way
  const planet = await planetsDatabase.findOne({
    keplerName: launch.target,
  });

  // if (!planet) {
  //   throw new Error("No matching planet found!");
  // }

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

const getLatestFlightNumber = async () => {
  // Minus (-) used in sort for descending order
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer IS1", //exists => rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", //not applicable
  customers: ["ZTM", "NASA"], //payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

saveLaunch(launch);
// launches.set(launch.flightNumber, launch);
// launches.set(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v5/launches/query";
const loadLaunchesData = async () => {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
  }
};

const existsLaunchWithId = async (launchId) => {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
};

const abortLaunchById = async (launchId) => {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
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

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
};

// const addNewLaunch = (launch) => {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["Zero to Mastery", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// };

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  // addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
};
