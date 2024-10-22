import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users.js";
import evaluateRouter from "./routes/evaluate.js";
import shopRouter from "./routes/shop.js";
import classRouter from "./routes/class.js";
import adminRouter from "./routes/admin.js";
import Faq from "./models/Faq.js";

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://frontendgradelab.vercel.app',
      'https://app.gradelab.io',
      // Add any other origins you need
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/users", userRouter);
app.use("/evaluate", evaluateRouter);
app.use("/shop", shopRouter);
app.use("/class", classRouter);
app.use("/admin", adminRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Gradelab");
});

// FAQ route
app.get("/faq", async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving FAQs", error: error.message });
  }
});

// Database connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  connectDB();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
