"use client";
import { MainContext } from '@/context/context';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { FaRobot, FaTrophy } from 'react-icons/fa';
import { FiBook, FiChevronLeft, FiEdit3, FiFileText, FiHelpCircle, FiInfo, FiKey, FiPrinter, FiRefreshCw, FiRotateCw, FiSave, FiUser, FiUsers, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export default function Results() {
    const { evaluatorId } = useParams();

    const {
        getResults,
        getResultsTable,
        resultDataTable,
        resultData,
        setResultData,
        saveResult,
        revaluate
    } = useContext(MainContext);

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedRollNo, setSelectedRollNo] = useState(1);

    const [selectedPreviewTab, setSelectedPreviewTab] = useState(2);
    const [mounted, setMounted] = useState(false);

    const [revaluationPrompt, setRevaluationPrompt] = useState("");

    useEffect(() => {
        if (selectedTab === 0) {
            getResultsTable(evaluatorId);
        }
        else {
            getResults(evaluatorId, selectedRollNo);
            setInterval(() => {
                setMounted(true);
            }, 500);
        }
    }, [selectedTab, selectedRollNo]);

    return (
        <main className="w-screen h-screen bg-base-100 flex flex-col p-2 overflow-auto box-border">
            <div className='print flex items-center justify-between text-lg mb-4'>
                <div className='flex items-center text-lg'>
                    <button className='btn btn-sm btn-square text-lg mr-2' onClick={() => { window.history.back() }}><FiChevronLeft /></button> <p>Results</p>
                </div>
                <div className='flex justify-center'>
                    <div role="tablist" className="tabs-md tabs tabs-boxed">
                        <a role="tab" className={"tab " + (selectedTab === 0 ? "tab-active" : "")} onClick={() => setSelectedTab(0)}><FiFileText className='mr-2' /> Marksheet</a>
                        <a role="tab" className={"tab " + (selectedTab === 1 ? "tab-active" : "")} onClick={() => setSelectedTab(1)}><FiUser className='mr-2' /> Detailed View</a>
                    </div>
                </div>
                <div></div>
            </div>
            {selectedTab === 0 ? <div className="overflow-x-auto flex flex-col items-center justify-center">
                <div className="flex items-center justify-between mb-1 mt-4 w-full max-w-7xl">
                    <p className="flex items-center font-semibold text-xl"><FiFileText className="mr-2" /> {resultDataTable?.exam}</p>
                </div>
                <div className="flex items-center max-w-7xl w-full mb-5">
                    <p className="flex items-center text-sm mr-5"><FiBook className="mr-2" /> {resultDataTable?.class?.subject}</p>
                    <p className="flex items-center text-sm"><FiUsers className="mr-2" /> {resultDataTable?.class?.name} {resultDataTable?.class?.section}</p>
                </div>
                <div className='print flex w-full items-center max-w-7xl mb-5'>
                    <button className='btn btn-primary' onClick={() => window.print()}><FiPrinter />Print Marksheet</button>
                </div>
                <table className="table max-w-7xl">
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th className='print'>View Detailed Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            resultDataTable?.results?.map((student: any, i: number) => {
                                return <tr key={i}>
                                    <th>{student?.roll_no}</th>
                                    <td>{student?.student_name}</td>
                                    <td>{student?.score}</td>
                                    <td className='print'><button className='btn btn-primary btn-square' onClick={() => {
                                        setSelectedRollNo(student?.roll_no);
                                        setSelectedTab(1);
                                    }}><FiFileText /></button></td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div> : <div className='flex w-full justify-center overflow-y-auto'>
                <div className='flex flex-col w-full max-w-7xl'>
                    <div className="flex items-center">
                        <p className="flex items-center mr-4"><FiUser className="mr-2" /> Student</p>
                        <select className="select select-sm select-bordered w-full max-w-xs" onChange={(x) => setSelectedRollNo(parseInt(x.target.value))} value={selectedRollNo}>
                            <option disabled selected>Select Student</option>
                            {
                                resultDataTable?.results?.map((student: any, i: number) => {
                                    return <option key={i} value={student?.roll_no}>{student?.roll_no}. {student?.student_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className='w-full flex mt-2 border overflow-y-hidden'>
                        <div className='w-full rounded p-2 overflow-y-auto'>
                            {resultData?.score ? <div className='flex flex-col items-center text-lg font-semibold mt-2 mb-4'><FaTrophy className='mr-2' /><div>Total marks scored</div><p>{resultData?.score[0]} / {resultData?.score[1]}</p></div> : ""}
                            {
                                resultData?.results?.map((result: any, i: number) => {
                                    return <div key={i} className='border p-2 rounded mb-2'>
                                        <div className='flex flex-col text-lg font-semibold mb-6'><div className="mb-3 badge badge-md badge-neutral"><FiHelpCircle className='mr-1' />Question {result?.question_no}</div><p>{typeof result?.question === "object" ? JSON.stringify(result?.question) : result?.question}</p></div>
                                        <div className='flex flex-col mb-6'><div className="mb-3 badge badge-md badge-ghost"><FiEdit3 className='mr-1' />Answer</div><p>{typeof result?.answer === "object" ? JSON.stringify(result?.answer) : result?.answer}</p></div>
                                        <div className='flex flex-col mb-6'><div className="mb-3 badge badge-md badge-ghost"><FaTrophy className='mr-1' />Score</div><p><input type="text" className="input input-bordered w-20" value={result?.score[0]} onChange={(x) => {
                                            // set new score, accept decimals too, also accept empty string
                                            if (x.target.value === "" || !isNaN(parseFloat(x.target.value))) {
                                                result.score[0] = x.target.value;
                                                setResultData({ ...resultData });
                                            }

                                            //if new score is more than total marks, set it to total marks
                                            if (parseFloat(x.target.value) > result?.score[1]) {
                                                result.score[0] = result?.score[1];
                                                setResultData({ ...resultData });
                                            }
                                        }} /> / {result?.score[1]}</p></div>
                                        <div className='flex flex-col mb-6'><div className="mb-3 badge badge-md badge-ghost"><FiInfo className='mr-1' />Remarks</div><p>{result?.remarks}</p></div>
                                        <div className='flex flex-col mb-6'><div className="mb-3 badge badge-md badge-ghost"><FaRobot className='mr-1' />AI Confidence</div><progress className={"mb-1 progress w-56 " + (result?.confidence === 1 ? "progress-success" : result?.confidence === 0 ? "progress-error" : "progress-warning")} value={result?.confidence === 1 ? "100" : result?.confidence === 0 ? "0" : "50"} max="100"></progress><span className={"text-sm font-semibold " + (result?.confidence === 1 ? "text-green-500" : result?.confidence === 0 ? "text-red-500" : "text-orange-500")}>{(result?.confidence === 1 ? "High" : result?.confidence === 0 ? "Low" : "Medium")}</span></div>
                                    </div>
                                })
                            }
                        </div>
                        <div className='flex flex-col w-full h-full'>
                            <div className='flex p-2'>
                                <div role="tablist" className="tabs-sm tabs tabs-boxed">
                                    <a role="tab" className={"tab " + (selectedPreviewTab === 2 ? "tab-active" : "")} onClick={() => setSelectedPreviewTab(2)}><FiEdit3 className='mr-2' /> Answer Sheets</a>
                                    <a role="tab" className={"tab " + (selectedPreviewTab === 0 ? "tab-active" : "")} onClick={() => setSelectedPreviewTab(0)}><FiFileText className='mr-2' /> Question Paper</a>
                                    <a role="tab" className={"tab " + (selectedPreviewTab === 1 ? "tab-active" : "")} onClick={() => setSelectedPreviewTab(1)}><FiKey className='mr-2' /> Answer Key</a>
                                </div>
                            </div>
                            <div className='h-full w-full overflow-y-auto px-2'>
                                {mounted && ([resultData?.question_papers, resultData?.answer_keys, resultData?.answer_sheets][selectedPreviewTab])?.map((file: string, i: number) => {
                                    return <TransformWrapper key={i} initialScale={1} wheel={{ wheelDisabled: true }}>
                                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (<>
                                            <div className="flex tools p-2 items-center">
                                                <p className='mr-2'>Page {i + 1}</p>
                                                <button className='btn btn-circle btn-sm mr-2' onClick={() => zoomIn()}><FiZoomIn /></button>
                                                <button className='btn btn-circle btn-sm mr-2' onClick={() => zoomOut()}><FiZoomOut /></button>
                                                <button className='btn btn-circle btn-sm mr-2' onClick={() => resetTransform()}><FiRotateCw /></button>
                                            </div>
                                            <TransformComponent>
                                                <img key={i} src={file} className="w-full border object-cover mr-2 mb-2" />
                                            </TransformComponent>
                                        </>)}
                                    </TransformWrapper>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='my-2 flex items-center'>
                        <label htmlFor='revaluate_modal' className='btn mr-4'><FiRefreshCw /> Revaluate</label>
                        <button className='btn btn-primary' onClick={() => {
                            for (var result of resultData?.results) {
                                if (result?.score[0] === "") {
                                    toast.error("Please fill all the scores");
                                    return;
                                }

                                if (result?.score[0].toString()?.charAt(result?.score[0].length - 1) === ".") {
                                    result.score[0] = result.score[0].slice(0, -1);
                                }
                            }

                            for (var result of resultData?.results) {
                                if (result?.score[0] !== "") {
                                    result.score[0] = parseFloat(result?.score[0]);
                                    if (result?.score[0] % 1 === 0) {
                                        result.score[0] = parseInt(result?.score[0]);
                                    }
                                }
                            }

                            setResultData({ ...resultData });
                            saveResult(evaluatorId, selectedRollNo, resultData?.results);
                        }}><FiSave /> Save Changes</button>
                    </div>
                </div>
            </div>
            }
            {/* Edit Class Modal */}
            <input type="checkbox" id="revaluate_modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <h3 className="flex items-center font-bold text-lg"><FiRefreshCw className="mr-1" /> Revaluate</h3>
                    <p className="flex items-center py-4">Prompt / Conditions (optional)</p>
                    <textarea className="textarea textarea-bordered h-32 mb-4 w-full" placeholder="Enter the prompt / conditions for revaluation. For example: 'Give full marks if student has attempted the question'. Leave blank if none." onChange={(x) => setRevaluationPrompt(x.target.value)} value={revaluationPrompt} />
                    <div className="modal-action">
                        <label htmlFor="revaluate_modal" className="btn">Cancel</label>
                        <label htmlFor="revaluate_modal" className="btn btn-primary" onClick={() => {
                            toast.promise(revaluate(evaluatorId, selectedRollNo, revaluationPrompt), {
                                pending: "Revaluating...",
                                success: "Revaluation complete",
                                error: "Failed to revaluate"
                            });
                        }}>Revaluate</label>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor="revaluate_modal">Cancel</label>
            </div>
        </main >
    )
}