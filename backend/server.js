import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import userRouter from "./routes/users.js";
import evaluateRouter from "./routes/evaluate.js";
import shopRouter from "./routes/shop.js";
import classRouter from "./routes/class.js";
import adminRouter from "./routes/admin.js";
import pdfImgRouter from "./routes/pdfimg.js";
import Faq from "./models/Faq.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/users", userRouter);
app.use("/evaluate", evaluateRouter);
app.use("/shop", shopRouter);
app.use("/class", classRouter);
app.use("/admin", adminRouter);
app.use("/pdfimg", pdfImgRouter);

app.get("/", (req, res) => {
    res.send("EvaluateAI API");
});

app.get("/faq", async (req, res) => {
    res.send(await Faq.find());
})

async function connectDB() {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
}

connectDB();

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});