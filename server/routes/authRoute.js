import express from "express";
import { body, validationResult } from "express-validator";
import {
  getMe,
  login,
  register,
  resetPassword,
  verifyOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

//validation middleware
const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg,
    });
  }

  next();
};

//POST /api/auth/register

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  handleValidationError,
  register,
);

//POST /api/auth/login

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  handleValidationError,
  login,
);

//GET /api/auth/me
router.get("/me", protect, getMe);
router.put(
  "/reset-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
  ],
  handleValidationError,
  resetPassword,
);
router.put(
  "/verify-otp",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("otp")
      .trim()
      .isLength({ min: 4, max: 6 })
      .withMessage("OTP must be 4 to 6 digits")
      .isNumeric()
      .withMessage("OTP must only contain numbers"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  handleValidationError,
  verifyOtp,
);
export default router;
