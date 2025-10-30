import {User} from '../models/user.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const userSignup = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    res.status(400).json({ message: "Email and password is required" });
  }
    const user = await User.findOne({email})
  if (user) {
    res.status(400).json({ error: "Email is already exist" });
  }
  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    email, password: hashPassword
  })
  let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY)
  res.status(200).json({ token, user: newUser });
}
export const userLogin = async (req, res) => {

}
export const getUser = async (req, res) => {

}