import joi from "joi";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validate } from "../middlewares/validate.js";
import { logoBase64 } from "../utils/utils.js";
import dotenv from "dotenv";
import EmailVerification from "../models/EmailVerification.js";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import Limits from "../models/Limits.js";
import rateLimit from "express-rate-limit"; 

dotenv.config();


const router = express.Router();

// Define the rate limiter for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    message: "Too many login attempts from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
        return res.status(options.statusCode).send(options.message);
    },
});

router.get("/", validate, (req, res) => {
    res.send("Users");
});

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

router.post("/signup", async (req, res) => {
    const schema = joi.object({
        name: joi.string().min(3).required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
        password: joi.string().pattern(passwordRegex).required().messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
        }),
    });

    try {
        const data = await schema.validateAsync(req.body);

        if (await User.findOne({ email: data.email }))
            return res.status(400).send("Email already exists");

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const users = await User.find();

        const newUser = new User({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            type: users.length == 0 ? 0 : 1,
        });

        const savedUser = await newUser.save();

        const newLimits = new Limits({
            userId: savedUser._id,
            evaluatorLimit: 2,
            evaluationLimit: 5,
        });

        await newLimits.save();

        return res.send(savedUser);
    } catch (err) {
        return res.status(400).send(err.details[0].message);
    }
});

router.post("/login", async (req, res) => {
    const schema = joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
        password: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const user = await User.findOne({ email: data.email });

        if (!user) return res.status(400).send("Invalid email or password");

        const validPassword = await bcrypt.compare(data.password, user.password);

        if (!validPassword)
            return res.status(400).send("Invalid email or password");

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        return res.send({ user: user, token: token });
    } catch (err) {
        return res.status(400).send(err.details[0].message);
    }
});

async function sendEmail(email, res) {
    const transporter = nodemailer.createTransport(
        smtpTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            requireTLS: true,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {rejectUnauthorized: false}
        })
    );

    var minm = 1000;
    var maxm = 9999;
    const code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    const logoHTML = `<img width="200px" src='cid:logo'/>`;

    const options = {
        from: `${process.env.APP_NAME} <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Verify your email address`,
        attachments: [
            {
    filename: `${process.env.APP_NAME}.png`,
    path: "https://gradelab.io/wp-content/uploads/2024/10/GradeLab-black.png", // Updated logo image link
    cid: "logo",
},
        ],
        html: `<div style="height:100%;background:black;color:white;padding:40px;"><center>${logoHTML}<br/><h2>Verify your email</h2></center><br/><p style="font-size:18px;">${process.env.APP_NAME} verification code: <b>${code.toString()}</b></p><br/><br/></div>`,
    };

    transporter.sendMail(options, async (err, info) => {
        if (err) {
            return res.status(500).send(err);
        }

        const emailVerification = await EmailVerification.findOne({
            email: email,
        });
        if (emailVerification) {
            await EmailVerification.findOneAndUpdate(
                { email: email },
                { code: code.toString() }
            );
        } else {
            const newEmailVerification = new EmailVerification({
                email: email,
                code: code.toString(),
                isVerified: false,
            });

            await newEmailVerification.save();
        }

        return res.send("Email sent!");
    });
}

router.post("/send-verification-code", async (req, res) => {
    const schema = joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const emailVerification = await EmailVerification.findOne({
            email: data.email,
        });
        if (emailVerification && emailVerification.isVerified)
            return res.status(400).send("Email already verified");

        await sendEmail(data.email, res);
    } catch (err) {
        return res.status(400).send(err.details[0].message);
    }
});

router.post("/verify-email", async (req, res) => {
    const schema = joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
        code: joi.string().length(4).required(),
    });

    try {
        const data = await schema.validateAsync(req.body);
        const emailVerification = await EmailVerification.findOne({
            email: data.email,
        });

        if (!emailVerification) return res.status(404).send("Email not found");

        if (emailVerification.code === data.code) {
            await EmailVerification.updateOne(
                { email: data.email },
                { isVerified: true }
            );
            return res.send("Email verified!");
        } else {
            return res.status(400).send("Invalid code");
        }
    } catch (err) {
        return res.status(400).send(err.details[0].message);
    }
});

export default router;
