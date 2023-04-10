import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import expressAsyncHandler from "express-async-handler";
import { generateToken } from "../utils.js";

export const signin = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        number: user.number,
        address: user.address,
        city: user.city,
        state: user.lstate,
        zipcode: user.zipcode,
        isUser: user.isUser,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid email or password" });
});

export const signup = expressAsyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.send({
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    number: user.number,
    address: user.address,
    city: user.city,
    state: user.lstate,
    zipcode: user.zipcode,
    isUser: user.isUser,
    token: generateToken(user),
  });
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  //console.log(req.user, "update");

  const user = await User.findById(req.user._id);

  if (user) {
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.number = req.body.number || user.number;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.lstate = req.body.lstate || user.lstate;
    user.zipcode = req.body.zipcode || user.zipcode;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
    }

    const update = await user.save();
    
    res.send({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      number: user.number,
      address: user.address,
      city: user.city,
      state: user.lstate,
      zipcode: user.zipcode,
      isUser: user.isUser,
      token: generateToken(update),
    });
  } else {
    res.status(401).send({ message: "user not found" });
  }
});

export const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      res
        .status(404)
        .send({ message: "there is noone with that email Address" })
    );
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  try {
    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/resetPassword/${resetToken}`;

    const resetURL = `${req.protocol}://${req.get(
      "x-forwarded-host"
    )}/resetPassword/${resetToken}`;

    sendEmail(req.body.email, resetURL);

    res.send({ message: "token sent to email" });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      res.status(500).send({ message: "there was an error sending an email" })
    );
  }
});

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    createPasswordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      res.status(400).send({ message: "time to update password expired" })
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.createPasswordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.send({ message: "password Changed" });
});

export const getUserById = expressAsyncHandler(async (req, res) => {
  const getUser = await User.findById(req.params.id);

  res.send(getUser);
});

export const getUsers = expressAsyncHandler(async (req, res) => {
  const getUsers = await User.find();
  res.send(getUsers);
});
