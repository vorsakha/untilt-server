import express, { Request, Response } from "express";
const route = express.Router();
const userModel = require("../models/User");
const auth = require("../middleware/auth");

// Get user by token
route.get("/", auth, async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get all users
route.get("/all", auth, async (req: Request, res: Response) => {
  try {
    const user = await userModel.find().select("-password");

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = route;
