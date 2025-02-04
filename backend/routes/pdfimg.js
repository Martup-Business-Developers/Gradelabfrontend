import joi from "joi";
import express from "express";
import { validate } from "../middlewares/validate.js";
import pdf2img from "pdf-img-convert";

const router = express.Router();

router.post("/convert-pdf", validate, async (req, res) => {
    try {
        const file = req.files.file;

        const arrayBuffer = file.data.buffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        const images = await pdf2img.convert(uint8Array);

        return res.send(images);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});


export default router;