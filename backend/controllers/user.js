import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from '../models/user.js';

export const userSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password is required" });

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ error: "Email already exists" });

    const hashPwd = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashPwd });
    const token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY);

    res.status(201).json({ token, user: newUser, message: 'signup successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password is required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY);
    res.status(200).json({ token, user, message: 'login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};