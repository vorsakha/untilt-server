import express, { Request, Response } from "express";
const route = express.Router();
const bugModel = require("../models/Bug");
const auth = require("../middleware/auth");

// Create or edit bug
route.post("/", auth, async (req: Request, res: Response) => {
  const { name, details, steps, priority, assigned, version } = req.body;

  try {
    // Test if bug exists
    let bugExists = await bugModel.findOne({ name: name });

    // If bug exists update it.
    if (bugExists) {
      const { status } = req.body;

      bugExists = await bugModel.findOneAndUpdate(
        { name: name },
        { $set: { name, details, steps, priority, assigned, version, status } },
        { new: true }
      );
      return res.json({ msg: "Bug updated.", bug: bugExists });
    }

    // Create new bug
    const newBug = new bugModel({
      name,
      details,
      steps,
      priority,
      assigned,
      version,
      status: "pending",
    });

    // Save new bug
    const bug = await newBug.save();

    res.send({ msg: "Bug created.", bug: bug });
  } catch (error) {
    if (error) return res.status(400).send(error);
  }
});

// Delete bug
route.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const bug = await bugModel.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ msg: "Bug not found" });
    }

    //-> Check if user is admin
    if (bug.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await bug.remove();

    const bugs = await bugModel.find().sort({ priority: 1 });

    res.json(bugs);
  } catch (error) {
    console.error(error);
    // if (error.kind === "ObjectId") {
    //   return res.status(404).json({ msg: "Bug not found" });
    // }
    res.status(500).send("Server Error");
  }
});

// Get all bugs
route.get("/", auth, async (req: Request, res: Response) => {
  try {
    const bugs = await bugModel.find().sort({ priority: 1 });

    res.json(bugs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get bug by name
route.post("/name", auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    let bugExists = await bugModel.findOne({ name: name });

    if (!bugExists) {
      return res.json(false);
    }

    res.json(true);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = route;
