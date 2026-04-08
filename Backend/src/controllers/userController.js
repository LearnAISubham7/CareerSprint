import TaskInstance from "../models/TaskInstance.js";

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const activity = await TaskInstance.aggregate([
      {
        $match: {
          user: userId,
          status: "DONE",
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json({ activity });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};
