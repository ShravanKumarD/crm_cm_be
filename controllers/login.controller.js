const db = require("../models/index");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer=require('nodemailer');

exports.authenticate = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Content can not be empty!" });
    }

    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) {
      return res.status(403).json({ message: "Incorrect Credentials!" });
    }

    if (!user.status) {
      return res.status(403).json({ message: "Account is not active!" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Incorrect Credentials!" });
    }

    const userData = {
      id: user.id,
      email:user.email,
      role: user.role,
      department: user.department ? user.department : null,
    };

    const token = jwt.sign({ user: userData }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    res.cookie("token", token);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};




exports.signup = async (req, res) => {
  try {
    const {name, email,mobile,department, password, role } = req.body;

    // Validate request
    if (!email || !password ) {
      return res.status(400).json({ message: "Required fields cannot be empty!" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
      department,
      status: 'active',
    });

    // Generate JWT token
    const userData = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department ? newUser.department : null,
    };

    const token = jwt.sign({ user: userData }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    // Return the token and user data
    return res.status(201).json({ token, user: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred during signup." });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate request
    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    // Check if the email exists in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist!" });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // You can save the token in the database if you want to track it
    user.resetToken = resetToken;
    await user.save();

    // Set up nodemailer to send the reset email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your email service provider
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please use the following link to reset your password:
      ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}

      If you did not request this, please ignore this email. The link will expire in 1 hour.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred during the password reset process." });
  }
};
