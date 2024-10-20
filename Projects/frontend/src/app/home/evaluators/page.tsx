"use client";
import { useContext, useEffect, useRef } from "react";
import { FiBook, FiCheck, FiExternalLink, FiFileText, FiImage, FiInfo, FiKey, FiShoppingCart, FiUsers } from "react-icons/fi";
import { MainContext } from "@/context/context";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import { FaTrophy } from "react-icons/fa";
import Link from "next/link";
import { appName } from "@/utils/utils";

export default function Evaluators() {
  const {
    evaluators,
    selectedEvaluator,
    setSelectedEvaluator,
    getStudents,
    students,
    updateEvaluation,
    getEvaluation,
    answerSheets,
    setAnswerSheets,
    evaluate,
    evaluating,
    setEvaluating,
    evaluationData,
    setImgPreviewURL,
    imgPreviewURL,
    limits
  } = useContext(MainContext);

  const limitExceedModalRef = useRef<any | null>(null);

  useEffect(() => {
    getStudents(evaluators[selectedEvaluator]?.classId);
    getEvaluation();
  }, [selectedEvaluator]);

  const evaluateAnswerSheets = async () => {
    if (students.length < 1) {
      return;
    }

    for (let i = 0; i < students.length; i++) {
      if (!answerSheets[i] || answerSheets[i].length < 1) {
        continue;
      }
      var val = await evaluate(i + 1);
      if (val === -3) {
        setEvaluating(-1);
        toast.error("Evaluation failed! Please try again later.");
        return;
      }
      else if (val === -2) {
        setEvaluating(-1);
        limitExceedModalRef.current?.click();
        return;
      }
      else if (val === -1) {
        setEvaluating(-1);
        toast.error("Evaluation failed! Please try again later.");
        return;
      }
    }

    setEvaluating(-1);
    toast.success("Evaluation completed!");
    getEvaluation();
    window.location.href = "/results/" + evaluators[selectedEvaluator]?._id;
  };

  return (
    evaluators.length === 0 ? (
      <div className="animate-fade-in-bottom flex flex-col w-full max-sm:max-w-none text-center py-10">
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="text-5xl font-bold mb-2">🤖 {appName} 📝</h1>
          <p>Create a new evaluator or select an existing evaluator to get started.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
            <div className="card bg-base-300 p-4 hover:bg-base-200">
              <h2 className="font-semibold text-md mb-2">🤖 AI-Powered Evaluation</h2>
              <p className="text-sm opacity-70">Leverage cutting-edge AI for accurate and efficient grading.</p>
            </div>
            <div className="card bg-base-300 p-4 hover:bg-base-200">
              <h2 className="font-semibold text-md mb-2">📊 Detailed Result Insights</h2>
              <p className="text-sm opacity-70">Explore detailed insights for a holistic view of student performance.</p>
            </div>
            <div className="card bg-base-300 p-4 hover:bg-base-200">
              <h2 className="font-semibold text-md mb-2">👥 Effortless Class Management</h2>
              <p className="text-sm opacity-70">Create, organize, and add students with ease.</p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="animate-fade-in-bottom flex flex-col w-full">
        <div className="hidden max-sm:flex justify-end mb-3">
          <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
            <FiBook className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-lg">
          <div>
            <h1 className="text-xl font-semibold mb-1 flex items-center">
              <FiFileText className="mr-2" /> {evaluators[selectedEvaluator]?.title}
            </h1>
            <p className="text-sm flex items-center">
              <FiBook className="mr-2" /> {evaluators[selectedEvaluator]?.class?.subject}
            </p>
            <p className="text-sm flex items-center">
              <FiUsers className="mr-2" /> {evaluators[selectedEvaluator]?.class?.name} {evaluators[selectedEvaluator]?.class?.section}
            </p>
          </div>
          {Object.keys(evaluationData).length && answerSheets.length >= 1 ? (
            <Link href={"/results/" + evaluators[selectedEvaluator]?._id}>
              <button className="btn btn-primary">
                <FaTrophy className="mr-2" /> View Results
              </button>
            </Link>
          ) : null}
        </div>
        <div className="divider max-w-lg"></div>
        <div className="overflow-y-auto">
          {/* Question Paper Section */}
          <section className="mb-4">
            <h2 className="font-semibold flex items-center mb-2">
              <FiFileText className="mr-2" /> Question Paper(s)
            </h2>
            <div className="flex flex-wrap">
              {evaluators[selectedEvaluator]?.questionPapers.map((file, i) => (
                <label key={i} htmlFor="preview_modal" onClick={() => setImgPreviewURL(file)}>
                  <img src={file} className="cursor-pointer w-20 h-20 border object-cover rounded-md mr-2 mb-2" />
                </label>
              ))}
            </div>
          </section>
          {/* Answer Key Section */}
          <section className="mb-4">
            <h2 className="font-semibold flex items-center mb-2">
              <FiKey className="mr-2" /> Answer Key / Criteria
            </h2>
            <div className="flex flex-wrap">
              {evaluators[selectedEvaluator]?.answerKeys.map((file, i) => (
                <label key={i} htmlFor="preview_modal" onClick={() => setImgPreviewURL(file)}>
                  <img src={file} className="cursor-pointer w-20 h-20 border object-cover rounded-md mr-2 mb-2" />
                </label>
              ))}
            </div>
          </section>
          {/* Upload Section */}
          <section className="mb-4">
            <h2 className="font-semibold flex items-center mb-2">
              <FiFileText className="mr-2" /> Upload answer sheets
            </h2>
            {students?.length === 0 ? (
              <div className="alert alert-info shadow-lg">
                <FiInfo className="w-6 h-6" />
                <div>
                  <h3>No students in class {evaluators[selectedEvaluator]?.class?.name}!</h3>
                  <p>Add students to the class to evaluate their answer sheets.</p>
                </div>
                <button className="btn btn-primary btn-sm">Add Students</button>
              </div>
            ) : (
              students?.map((student, i) => (
                <div key={i} className="flex flex-col mb-4">
                  <p>
                    {student?.rollNo}. {student?.name}
                    {evaluationData[student?.rollNo] && answerSheets[i]?.length ? (
                      <span className="ml-2 text-green-500 text-sm">
                        <FiCheck className="mr-1" /> Evaluated
                      </span>
                    ) : null}
                  </p>
                  {/* Answer sheet thumbnails */}
                  <div className="flex flex-wrap">
                    {answerSheets[i]?.map((file, j) => (
                      <div key={j} className="relative">
                        <button
                          className="btn btn-xs btn-circle absolute right-3 top-1"
                          onClick={() => {
                            answerSheets[i].splice(j, 1);
                            setAnswerSheets([...answerSheets]);
                            updateEvaluation(evaluators[selectedEvaluator]?._id, answerSheets);
                          }}
                        >
                          <FiInfo className="w-4 h-4" />
                        </button>
                        <label htmlFor="preview_modal" onClick={() => setImgPreviewURL(file)}>
                          <img src={file} className="cursor-pointer w-40 h-40 border object-cover rounded-md mr-2 mb-2" />
                        </label>
                      </div>
                    ))}
                  </div>
                  {!answerSheets[i]?.length ? (
                    <UploadDropzone
                      className="upload-area max-w-lg border-dashed border-2 rounded-lg p-6"
                      onDrop={(files) => {
                        if (!answerSheets[i]) answerSheets[i] = [];
                        files.forEach((file) => {
                          answerSheets[i].push(file.url);
                        });
                        setAnswerSheets([...answerSheets]);
                        updateEvaluation(evaluators[selectedEvaluator]?._id, answerSheets);
                      }}
                    />
                  ) : null}
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    )
  );
}
