import TaskInstance from "../models/TaskInstance.js";
import TaskTemplate from "../models/TaskTemplate.js";

// CREATE TEMPLATE
export const createTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      repeatType,
      startDate,
      endDate,
      expectedMinutes,
    } = req.body;

    if (!title || !repeatType || !startDate || !endDate) {
      return res.status(400).json({
        message: "title, repeatType, startDate, endDate are required",
      });
    }

    const template = await TaskTemplate.create({
      user: req.user._id,
      title,
      description: description || "",
      category: category || "OTHER",
      repeatType,
      startDate,
      endDate,
      expectedMinutes: expectedMinutes || 0,
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL MY TEMPLATES
export const getMyTemplates = async (req, res) => {
  try {
    const templates = await TaskTemplate.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTemplateActive = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const template = await TaskTemplate.findOne({ _id: id, user: userId });
    if (!template)
      return res.status(404).json({ message: "Template not found" });

    template.isActive = !template.isActive;
    await template.save();

    return res.json(template);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TEMPLATE
export const updateTemplate = async (req, res) => {
  try {
    const template = await TaskTemplate.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!template)
      return res.status(404).json({ message: "Template not found" });

    const fields = [
      "title",
      "description",
      "category",
      "repeatType",
      "startDate",
      "endDate",
      "expectedMinutes",
      "isActive",
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) template[f] = req.body[f];
    });

    await template.save();
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleteFuture = req.query.deleteFuture === "true";
    const deleteAll = req.query.deleteAll === "true";

    const template = await TaskTemplate.findOne({ _id: id, user: userId });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // delete instances first (safe)
    if (deleteAll) {
      await TaskInstance.deleteMany({
        user: userId,
        template: id,
      });
    } else if (deleteFuture) {
      const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

      await TaskInstance.deleteMany({
        user: userId,
        template: id,
        date: { $gte: todayStr },
      });
    }

    // now delete template
    await TaskTemplate.deleteOne({ _id: id, user: userId });

    return res.json({
      message: "Template deleted",
      deletedFuture: deleteFuture,
      deletedAll: deleteAll,
    });
  } catch (err) {
    console.log("DELETE TEMPLATE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};
