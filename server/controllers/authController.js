import User from "../model/User.js";
import { generateToken } from "../utils/jwt.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({
        success: false,
        error: "User already exists eith this email",
      });
    }

    //create a new user
    const user = await User.create({
      name,
      email,
      password,
    });

    //generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      message: "User register successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    //check if password matche

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    //generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      message: "User login successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      message: "User get successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const generateOtp = Math.floor(1000 + Math.random() * 9000); // Generate a 4 digit OTP

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Please signup first" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      port: 2525,
      auth: {
        user: "faizaniqbal2911@gmail.com",
        pass: "ilrgjbqjdfqxfwys",
      },
    });

    const info = await transporter.sendMail({
      from: "faizaniqbal2911@gmail.com",
      to: email,
      subject: "New OTP has been generated",
      html: `<h3>Your Generated Otp is : <i>${generateOtp}</i> </h3>`, // HTML version of the message
    });

    if (info.messageId) {
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: generateOtp,
          },
        },
      );
      return res
        .status(200)
        .json({ success: true, message: "Otp has been sent to your email" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY OTP ROUTE
export const verifyOtp = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP and new password are required",
    });
  }

  try {
    const user = await User.findOne({ email, otp }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or OTP",
      });
    }

    user.password = newPassword;
    user.otp = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
