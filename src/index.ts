import "module-alias/register";

import { type CipherKey } from "crypto";

import dotenv from "dotenv";
dotenv.config();

// Express
import express from "express";
import session from "express-session";
import cors from "cors";

// MongoDB
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

// Routes
import auth from "@/routes/auth";
import profile from "@/routes/profile";
import post from "@/routes/post";

// .env
const { PORT, MONGO_URI, SESSION_SECRET } = process.env;

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect(MONGO_URI as string);

// Session
const initSession = session({
  secret: SESSION_SECRET as CipherKey,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI as string }),
  cookie: { httpOnly: true, secure: false, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 },
});

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register
app.use(initSession);

// Router
app.use("/auth", auth);
app.use("/profile", profile);
app.use("/post", profile);

app.listen(PORT, () => console.log(`Server online on port: ${PORT}`));
