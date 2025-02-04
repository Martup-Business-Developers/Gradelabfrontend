import mongoose from "mongoose";

const MarkDistributionSchema = new mongoose.Schema(
    {
        evaluatorId: {
            type: mongoose.Schema.ObjectId,
            ref: "Evaluator",
            required: true,
        },  
        max_marks: {
            type: Number,
            required: true,
            default: 0,
        },
        or_questions: {
            type: Array,
            required: false,
            default: [],
        },
        questions: {
            type: Array,
            required: true,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const MarkDistribution = mongoose.model("MarkDistribution", MarkDistributionSchema);

export default MarkDistribution;