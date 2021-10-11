import express, { Request, Response } from "express";
const auth = require("../Middleware/auth");
import jwt from "jsonwebtoken";
import { hash } from "bcrypt";
const route = express.Router();
const userModel = require("../../Model/userModel");

// Create user
route.post("/user", async (req: Request, res: Response) => {
  try {
    const userExists = await userModel.findOne({ name: req.body.name });
    if (userExists) {
      res.send("User already exists");
      res.status(400);
      return;
    }

    hash(req.body.password, 10, async (err: any, hash: string) => {
      const newUser = new userModel({
        name: req.body.name,
        password: hash,
        role: req.body.role && req.body.role
      })

      const user = await newUser.save()

      res.send(user)
    })
  } catch (error) {
    if (error) return res.status(400).send(error);
  }
});

// Edit user
route.put("/user", auth, async (req: Request, res: Response) => {
  const { _id, name, password, role } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(_id, {
      name,
      password,
      role,
    });

    if (!user) {
      return res.status(400).send("No user found");
    }

    res.send("Updated successfully!");
  } catch (error) {
    if (error) return res.status(400).send(error);
  }
});

// Log user
route.post("/", async (req: Request, res: Response) => {
  const { name, password } = req.body;

  try {
    const user = await userModel.findOne({ name });

    if (!user) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Invalid credentials." }] });
    }

    // If user found check if password matches
    const isMatch = password === user.password;
    //const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Invalid credentials." }] });
    }

    // res.send(user.role ? true : false);

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: 3600 },
      (err: any, token) => {
        if (err) throw err;
        res.json({ user: user.name, token });
      }
    );
  } catch (error) {
    if (error) return res.status(400).send(error);
  }
});

module.exports = route;
