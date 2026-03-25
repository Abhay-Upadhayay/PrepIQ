import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcrypt";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
    try {
        const { name, email, password, targetExam, selectedSubjects } = req.body;

        if (!name || !email || !password || !targetExam || !selectedSubjects) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email,
            password: hashedPassword,
            targetExam,
            selectedSubjects
        });

        const token = jwt.sign(
            { id: user._id },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        const { password: _, ...safeUser } = user.toObject();
        res.status(201).json({ message: "User registered successfully", user: safeUser, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        const { password: _, ...safeUser } = user.toObject();
        res.status(200).json({ message: "User logged in successfully", user: safeUser, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};