import joi from "joi";
import express from "express";
import { validate } from "../middlewares/validate.js";
import Evaluator from "../models/Evaluator.js";
import Limits from "../models/Limits.js";
import Evaluation from "../models/Evaluation.js";
import Class from "../models/Class.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { aiModel, aiPrompt, markAnalysisPrompt, maxTokens } from "../utils/utils.js";
import MarkDistribution from "../models/MarkDistribution.js";
import EvaluationProgress from "../models/EvaluationProgress.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const router = express.Router();

//EVALUATORS
router.get("/evaluators", validate, async (req, res) => {
    const evaluators = await Evaluator.find({ userId: req.user._id }).lean();

    for (const evaluator of evaluators) {
        evaluator.class = await Class.findById(evaluator.classId).select("name section subject");
    }

    return res.send({ evaluators: evaluators.reverse(), user: { name: req.user.name, email: req.user.email, type: req.user.type }, limits: await Limits.findOne({ userId: req.user._id }).select("evaluatorLimit evaluationLimit") });
});

const createMarkDistribution = async (evaluatorId) => {
    const data = await Evaluator.findById(evaluatorId);

    const prompt = [];
    prompt.push({ type: "text", text: markAnalysisPrompt });
    prompt.push({ type: "text", text: "Question Paper(s):" });
    for (const questionPaper of data.questionPapers) {
        prompt.push({
            type: "image_url",
            image_url: { url: questionPaper },
        });
    }

    prompt.push({ type: "text", text: "Answer Key(s):" });
    for (const answerKey of data.answerKeys) {
        prompt.push({
            type: "image_url",
            image_url: { url: answerKey },
        });
    }

    var messages = [
        {
            role: "system",
            content: markAnalysisPrompt,
        },
        {
            role: "user",
            content: prompt,
        },
    ];

    const completion = await openai.chat.completions.create({
        model: aiModel,
        messages: messages,
        max_tokens: maxTokens,
    });

    var resp = completion.choices[0].message.content;

    resp = resp.replace(/```json\n|\n```/g, "");

    const respData = JSON.parse(resp);

    const existingMarkDistribution = await MarkDistribution.findOne({
        evaluatorId: evaluatorId,
    });

    if (existingMarkDistribution) {
        existingMarkDistribution.max_marks = respData.max_marks;
        existingMarkDistribution.questions = respData.questions;
        existingMarkDistribution.or_questions = respData.or_questions;
        await existingMarkDistribution.save();
    }
    else {
        const markDistribution = new MarkDistribution({
            evaluatorId: evaluatorId,
            max_marks: respData.max_marks,
            questions: respData.questions,
            or_questions: respData.or_questions,
        });
        await markDistribution.save();
    }
}

router.post("/evaluators/create", validate, async (req, res) => {
    const schema = joi.object({
        classId: joi.string().required(),
        title: joi.string().required(),
        questionPapers: joi.array().required(),
        answerKeys: joi.array().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const limits = await Limits.findOne({ userId: req.user._id });

        if (limits.evaluatorLimit <= 0) {
            return res.status(400).send("Evaluator limit exceeded");
        }

        const classData = await Class.findById(data.classId);
        if (!classData) {
            return res.status(400).send("Class not found");
        }

        limits.evaluatorLimit -= 1;

        await limits.save();

        const evaluator = new Evaluator({
            userId: req.user._id,
            classId: data.classId,
            title: data.title,
            questionPapers: data.questionPapers,
            answerKeys: data.answerKeys,
        });

        await evaluator.save();

        createMarkDistribution(evaluator._id);

        return res.send(evaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluators/delete", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const limits = await Limits.findOne({ userId: req.user._id });

        limits.evaluatorLimit += 1;

        await limits.save();

        await Evaluator.findByIdAndDelete(data.evaluatorId);

        await Evaluation.deleteOne({ evaluatorId: data.evaluatorId });

        return res.send("Evaluator deleted");
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluators/update", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        title: joi.string().required(),
        classId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        evaluator.title = data.title;
        evaluator.classId = data.classId;

        await evaluator.save();

        return res.send(evaluator);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluators/evaluate", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        rollNo: joi.number().required(),
        prompt: joi.string().required().allow(""),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        const limit = await Limits.findOne({ userId: req.user._id });

        if (limit.evaluationLimit <= 0) {
            return res.status(400).send("Evaluation limit exceeded");
        }

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        if (!evaluation) {
            return res.status(400).send("Evaluation not found");
        }

        const answerSheets = evaluation.answerSheets[data.rollNo - 1];

        if (!answerSheets) {
            return res.send(null);
        }

        const classData = await Class.findById(evaluator.classId);

        for (const answerSheet of evaluation.answerSheets) {
            if (answerSheet == null) {
                await Evaluation.updateOne({ evaluatorId: data.evaluatorId }, { $set: { ["data." + (evaluation.answerSheets.indexOf(answerSheet) + 1)]: null } });
            }
        }

        var questionPapersPrompt = [];
        var answerKeysPrompt = [];
        var answerSheetsPrompt = [];
        var markDistributionPrompt = [];

        questionPapersPrompt.push({ type: "text", text: "Question Paper(s):" });
        for (const questionPaper of evaluator.questionPapers) {
            questionPapersPrompt.push({ type: "image_url", image_url: { url: questionPaper } });
        }

        answerKeysPrompt.push({ type: "text", text: "Answer Key(s):" });
        for (const answerKey of evaluator.answerKeys) {
            answerKeysPrompt.push({ type: "image_url", image_url: { url: answerKey } });
        }

        answerSheetsPrompt.push({ type: "text", text: "Answer Sheet(s):" });
        for (const answerSheet of answerSheets) {
            answerSheetsPrompt.push({ type: "image_url", image_url: { url: answerSheet } });
        }

        const checkMarkDistribution = await MarkDistribution.findOne({
            evaluatorId: data.evaluatorId,
        });

        if (!checkMarkDistribution) {
            await createMarkDistribution(data.evaluatorId);
        }

        const markDistributionData = await MarkDistribution.findOne({
            evaluatorId: data.evaluatorId,
        });

        markDistributionPrompt.push({ type: "text", text: "Mark Distribution:" });
        markDistributionPrompt.push({
            type: "text",
            text: `MAX MARKS: ${markDistributionData.max_marks}`,
        });
        for (const question of markDistributionData.questions) {
            markDistributionPrompt.push({
                type: "text",
                text: `Question ${question.question_no}: ${question.marks} marks`,
            });
        }
        if (markDistributionData.or_questions) {
            markDistributionPrompt.push({
                type: "text",
                text: `OR Questions: ${markDistributionData.or_questions}`,
            });
        }

        var messages = [
            {
                role: "system",
                content: aiPrompt,
            },
            {
                role: "user",
                content: questionPapersPrompt,
            },
            {
                role: "user",
                content: answerKeysPrompt,
            },
            {
                role: "user",
                content: "student_name: " + classData.students[data.rollNo - 1].name,
            },
            {
                role: "user",
                content: "roll_no: " + classData.students[data.rollNo - 1].rollNo,
            },
            {
                role: "user",
                content: "class: " + classData.name + " " + classData.section,
            },
            {
                role: "user",
                content: "subject: " + classData.subject,
            },
            {
                role: "user",
                content: answerSheetsPrompt,
            },
        ];

        const progress = await EvaluationProgress.findOne({
            evaluatorId: data.evaluatorId,
            rollNo: data.rollNo,
        });

        if (progress) {
            await EvaluationProgress.updateOne({ evaluatorId: data.evaluatorId, rollNo: data.rollNo }, { $set: { prompt: data.prompt, status: "pending", finished: false } });
        }
        else {
            const newProgress = new EvaluationProgress({
                evaluatorId: data.evaluatorId,
                rollNo: data.rollNo,
                prompt: data.prompt,
                status: "pending",
                finished: false,
            });
            await newProgress.save();
        }

        const completion = await openai.chat.completions.create({
            model: aiModel,
            messages: messages,
            max_tokens: maxTokens,
        });

        var resp = completion.choices[0].message.content;

        resp = resp.replace(/```json\n|\n```/g, '')

        const respData = JSON.parse(resp);

        await Evaluation.updateOne({ evaluatorId: data.evaluatorId }, { $set: { ["data." + (data.rollNo)]: respData } });

        await Limits.updateOne({ userId: req.user._id }, { $inc: { evaluationLimit: -1 } });

        await EvaluationProgress.updateOne({ evaluatorId: data.evaluatorId, rollNo: data.rollNo }, { $set: { status: "success", finished: true } });

        return res.send(respData);
    }
    catch (err) {
        const data = await schema.validateAsync(req.body);
        await EvaluationProgress.updateOne({ evaluatorId: data.evaluatorId, rollNo: data.rollNo }, { $set: { status: "error", finished: true } });
        return res.status(500).send(err);
    }
});

//Evaluation progress SSE
const sseMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent immediately

    req.sse = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    req.on('close', () => {
        res.end();
    });

    next();
};

router.get("/evaluation-progress", async (req, res) => {
    const { evaluatorId, token } = req.query;

    if (token == null) return res.status(401).send("Unauthorized");

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).send("Unauthorized");
        const userData = await User.findOne({ _id: user }).lean();
        if (!userData) {
            return res.status(401).send("Unauthorized");
        }

        req.user = userData;
    });

    if (!evaluatorId) {
        return res.status(400).json({ error: "Evaluator ID is required." });
    }
    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const interval = setInterval(async () => {
        try {
            const updates = await EvaluationProgress.find({ evaluatorId })
                .sort({ updatedAt: -1 });

            let finished = true;
            for (const update of updates) {
                if (!update.finished) {
                    finished = false;
                    break;
                }
            }

            if (finished) {
                clearInterval(interval);
                res.write(`data: ${JSON.stringify(updates)}\n\n`);
                res.end();
                return;
            }

            res.write(`data: ${JSON.stringify(updates)}\n\n`);
        } catch (error) {
            res.write(`data: ${JSON.stringify({ error: "Failed to fetch data." })}\n\n`);
        }
    }, 1000);

    // Cleanup on client disconnect
    req.on("close", () => {
        clearInterval(interval);
    });
});

//EVALUATIONS
router.post("/evaluations/get", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        if (!evaluation) {
            return res.send(null);
        }

        for (const answerSheet of evaluation.answerSheets) {
            if (answerSheet == null) {
                await Evaluation.updateOne({ evaluatorId: data.evaluatorId }, { $set: { ["data." + (evaluation.answerSheets.indexOf(answerSheet) + 1)]: null } });
            }
        }

        return res.send(evaluation);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluations/update", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        answerSheets: joi.array(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        var answerSheetsData = [];

        for (var answerSheet of data.answerSheets) {
            if (answerSheet == null) {
                answerSheetsData.push(null);
            }
            else if (answerSheet.length <= 0) {
                answerSheetsData.push(null);
            }
            else {
                answerSheetsData.push(answerSheet);
            }
        }

        if (!evaluation) {
            const newEvaluation = new Evaluation({
                evaluatorId: data.evaluatorId,
                data: data.data,
                answerSheets: answerSheetsData,
            });

            await newEvaluation.save();

            return res.send(newEvaluation);
        }

        evaluation.answerSheets = answerSheetsData;
        await evaluation.save();

        return res.send(evaluation);
    }
    catch (err) {
        return res.send(err);
    }
});

router.post("/evaluations/results", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        rollNo: joi.number().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        if (!evaluation) {
            return res.send(null);
        }

        const marksDistribution = await MarkDistribution.findOne({
            evaluatorId: data.evaluatorId,
        });

        var resultsData = {};
        const students = (await Class.findById(evaluator.classId)).students;
        var studentData = {};

        for (const student of students) {
            if (data.rollNo === -1) {
                studentData = student;
                break;
            }

            if (student.rollNo === data.rollNo) {
                studentData = student;
            }
        }

        if (!evaluation.data[studentData.rollNo]) {
            return res.send({});
        }

        var totalScore = marksDistribution.max_marks;
        var scored = 0;

        for (const answer of evaluation.data[studentData.rollNo].answers) {
            scored += answer.score[0];
        }

        resultsData["student_name"] = studentData.name;
        resultsData["roll_no"] = studentData.rollNo;
        resultsData["class"] = (await Class.findById(evaluator.classId)).name + " " + (await Class.findById(evaluator.classId)).section;
        resultsData["subject"] = (await Class.findById(evaluator.classId)).subject;
        resultsData["question_papers"] = evaluator.questionPapers;
        resultsData["answer_keys"] = evaluator.answerKeys;
        resultsData["answer_sheets"] = evaluation.answerSheets[studentData.rollNo - 1];
        resultsData["results"] = evaluation.data[studentData.rollNo].answers;
        resultsData["score"] = [scored, totalScore];

        return res.send(resultsData);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluations/results/all", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        if (!evaluation) {
            return res.send(null);
        }

        const marksDistribution = await MarkDistribution.findOne({
            evaluatorId: data.evaluatorId,
        });

        var resultsData = [];

        const classData = await Class.findById(evaluator.classId);
        const students = classData.students;

        for (const student of students) {
            var studentData = {};

            if (!evaluation.data[student.rollNo]) {
                continue;
            }

            studentData["student_name"] = student.name;
            studentData["roll_no"] = student.rollNo;
            var scored = 0;
            var totalScore = marksDistribution.max_marks;

            for (const answer of evaluation.data[student.rollNo].answers) {
                scored += answer.score[0];
            }

            studentData["score"] = scored + " / " + totalScore;

            resultsData.push(studentData);
        }

        return res.send({ class: { name: classData.name, section: classData.section, subject: classData.subject }, exam: evaluator.title, results: resultsData });
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluations/results/save", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
        rollNo: joi.number().required(),
        results: joi.array().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        const evaluator = await Evaluator.findById(data.evaluatorId);

        if (!evaluator) {
            return res.status(400).send("Evaluator not found");
        }

        if (evaluator.userId.toString() != req.user._id.toString()) {
            return res.status(400).send("Unauthorized");
        }

        const evaluation = await Evaluation.findOne({ evaluatorId: data.evaluatorId });

        if (!evaluation) {
            return res.send(null);
        }

        //update the results
        await Evaluation.updateOne({ evaluatorId: data.evaluatorId }, { $set: { ["data." + data.rollNo + ".answers"]: data.results } });

        return res.send(evaluation);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

router.post("/evaluations/delete", validate, async (req, res) => {
    const schema = joi.object({
        evaluatorId: joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        await Evaluation.deleteOne({ evaluatorId: data.evaluatorId });

        return res.send("Evaluation deleted");
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

export default router;