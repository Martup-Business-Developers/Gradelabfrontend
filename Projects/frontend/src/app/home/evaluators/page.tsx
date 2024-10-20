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
    evaluators.length === 0 ? <div className="animate-fade-in-bottom flex flex-col w-full max-sm:max-w-none">
      <div className='select-none flex flex-col justify-center items-center w-full h-full'>
        <p className='text-5xl font-semibold mb-2'>🤖 {appName} 📝</p>
        <p className='text-center'>Create a new evaluator or select an existing evaluator to get started.</p>
        <div className='flex flex-wrap justify-center mt-7'>
          <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
            <p className='font-semibold text-md mb-2'>🤖 AI-Powered Evaluation</p>
            <p className='text-sm opacity-70'>Leverage cutting-edge AI for accurate and efficient grading.</p>
          </div>
          <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
            <p className='font-semibold text-md mb-2'>📊 Detailed Result Insights</p>
            <p className='text-sm opacity-70'>Explore detailed insights for a holistic view of student performance.</p>
          </div>
          <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
            <p className='font-semibold text-md mb-2'>👥 Effortless Class Management</p>
            <p className='text-sm opacity-70'>Create, organize, and add students with ease.</p>
          </div>
        </div>
      </div>
    </div> : <div className="animate-fade-in-bottom flex flex-col w-full max-sm:max-w-none">
      <div className="hidden max-sm:flex justify-end mb-3">
        <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex items-center justify-between max-w-lg">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1 mt-4 w-full max-w-lg">
            <p className="flex items-center font-semibold text-xl"><FiFileText className="mr-2" /> {evaluators[selectedEvaluator]?.title}</p>
          </div>
          <div className="flex items-center">
            <p className="flex items-center text-sm mr-5"><FiBook className="mr-2" /> {evaluators[selectedEvaluator]?.class?.subject}</p>
            <p className="flex items-center text-sm"><FiUsers className="mr-2" /> {evaluators[selectedEvaluator]?.class?.name} {evaluators[selectedEvaluator]?.class?.section}</p>
          </div>
        </div>
        {Object.keys(evaluationData).length && answerSheets.length >= 1 ? <Link href={"/results/" + evaluators[selectedEvaluator]?._id}><label className="btn btn-primary"><FaTrophy /> View Results</label></Link> : ""}
      </div> <div className="divider max-w-lg"></div>
      <div className="overflow-y-auto">
        <p className="flex items-center mb-2 mt-4"><FiFileText className="mr-2" /> Question Paper(s)</p>
        <div className="flex flex-wrap">{
          evaluators[selectedEvaluator]?.questionPapers.map((file: string, i: number) => {
            return <label key={i} htmlFor="preview_modal" onClick={() => setImgPreviewURL(file)}><img key={i} src={file} className="cursor-pointer w-20 h-20 border object-cover rounded-md mr-2 mb-2" /></label>
          })
        }</div>
        <p className="flex items-center mb-2 mt-4"><FiKey className="mr-2" /> Answer Key / Criteria</p>
        <div className="flex flex-wrap">{
          evaluators[selectedEvaluator]?.answerKeys.map((file: string, i: number) => {
            return <label key={i} htmlFor="preview_modal" onClick={() => setImgPreviewURL(file)}><img key={i} src={file} className="cursor-pointer w-20 h-20 border object-cover rounded-md mr-2 mb-2" /></label>
          })
        }</div>
        <p className="flex items-center mb-1 mt-4"><FiFileText className="mr-2" /> Upload answer sheets</p>
        <div className="max-h-full max-w-lg mt-4">
          {students?.length === 0 ? <div role="alert" className="alert shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 className="font-bold">No students in class {evaluators[selectedEvaluator]?.class?.name} {evaluators[selectedEvaluator]?.class?.section}!</h3>
              <div className="text-xs">You need to add students to the class to evaluate their answer sheets.</div>
            </div>
            <label onClick={() => window.location.href = "/home/classes"} className="btn btn-primary btn-sm">Add Students</label>
          </div> :
            students?.map((student: any, i: any) => (
              <div key={i} className="flex flex-col max-w-lg mb-4">
                <p className="flex items-center mb-1">{student?.rollNo}. {student?.name} {evaluationData[student?.rollNo] && (answerSheets[i] && answerSheets[i]?.length >= 1) ? <span className="ml-2 flex items-center text-green-500 text-sm"><FiCheck className="mr-2" /> Evaluated</span> : ""}</p>
                {answerSheets[i] && answerSheets[i]?.length >= 1 ? <div className="flex flex-wrap">{
                  answerSheets[i]?.map((file: string, j: number) => {
                    return <div key={j} className="relative flex items-center justify-center">
                      {evaluating === student?.rollNo ? <div className="bg-white p-1 rounded-full absolute flex items-center text-sm"><span className="mr-1 loading loading-spinner loading-sm"></span><p>Evaluating...</p></div> : ""}
                      <button className="btn btn-xs btn-circle absolute right-3 top-1" onClick={() => {
                        answerSheets[i].splice(j, 1);
                        setAnswerSheets([...answerSheets]);
                        updateEvaluation(evaluators[selectedEvaluator]?._id, answerSheets);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <label htmlFor="preview_modal" onClick={() => setImgPreviewURL(file)}><img key={j} src={file} className="cursor-pointer w-40 h-40 border object-cover rounded-md mr-2 mb-2" /></label>
                    </div>
                  })
                }</div> : <UploadDropzone
                  endpoint="media"
                  onClientUploadComplete={(res) => {
                    var files = [];
                    for (const file of res) {
                      files.push(file.url);
                    }

                    answerSheets[i] = files;
                    setAnswerSheets([...answerSheets]);
                    updateEvaluation(evaluators[selectedEvaluator]?._id, answerSheets);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />}
              </div>
            ))
          }
        </div>
      </div>
      {evaluating !== -1 ? <div className="flex flex-col mb-5">
        <p className="mb-2">Evaluating Answer Sheets of {students[evaluating - 1]?.name}... (Student {evaluating} of {students.length})</p>
        <progress className="progress max-w-lg" value={evaluating} max={students.length}></progress>
      </div> : <button className="btn btn-primary w-full max-w-lg mt-5" onClick={() => evaluateAnswerSheets()}>🤖 Evaluate</button>}
      <div className="flex justify-center my-2 max-w-lg">
        <p className="flex items-center text-xs opacity-70 mr-1"><FiFileText className="mr-1" /> {limits?.evaluationLimit} evaluations left</p>
        <Link href="/shop"><button className="btn btn-xs btn-ghost"><FiShoppingCart /> SHOP</button></Link>
      </div>
      <input type="checkbox" id="preview_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold flex items-center"><FiImage className="mr-2" /> Preview</h3>
            <button className="btn btn-square" onClick={() => window.open(imgPreviewURL)}><FiExternalLink /></button>
          </div>
          <img src={imgPreviewURL} className="w-full h-full object-contain" />
        </div>
        <label className="modal-backdrop" htmlFor="preview_modal">Close</label>
      </div>
      {/* Evaluation Limit Exceed Modal */}
      <input type="checkbox" id="evaluationlimitexceed_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiInfo className="mr-1" /> Evaluation limit exceeded</h3>
          <p className="py-4">You have reached the maximum limit of evaluations.<br />You can purchase more evaluations from the shop.</p>
          <div className="modal-action">
            <label ref={(x) => limitExceedModalRef.current = x} htmlFor="evaluationlimitexceed_modal" className="btn">Cancel</label>
            <label htmlFor="evaluationlimitexceed_modal" className="btn btn-primary" onClick={() => window.location.href = "/shop"}><FiShoppingCart /> Shop</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="evaluationlimitexceed_modal">Cancel</label>
      </div>
    </div>
  );
}
