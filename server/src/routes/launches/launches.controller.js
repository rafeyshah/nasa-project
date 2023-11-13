const {
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const httpGetAllLaunches = async (req, res) => {
  return res.status(200).json(await getAllLaunches());
};

const httpAddNewLaunch = (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  try {
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate.valueOf())) {
      return res.status(400).json({
        error: "Invalid launch date",
      });
    }

    // addNewLaunch(launch);
    scheduleNewLaunch(launch);
    return res.status(201).json(launch);
  } catch (err) {
    res.status(400).json({ err: "No matching planet found!" });
  }
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);

  // if launch doesn't exist
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  // if launch does exist
  const aborted = await abortLaunchById(launchId);
  return res.status(200).json(aborted);
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
