"use client";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiMoreHorizontal,
  FiSettings,
  FiUser,
  FiLogOut,
  FiFileText,
  FiEdit,
  FiTrash,
  FiArrowRight,
  FiShoppingCart,
  FiShoppingBag,
  FiType,
  FiPlusCircle,
  FiKey,
  FiUsers,
  FiBook,
  FiInfo,
} from "react-icons/fi";
import Link from "next/link";
import { appName } from "@/utils/utils";
import { UploadButton } from "@/utils/uploadthing";
import { MainContext } from "@/context/context";
import { usePathname } from "next/navigation";

export default function Home({ children }: { children: React.ReactNode }) {
  const {
    moreMenuOpen,
    setMoreMenuOpen,
    showMenu,
    setShowMenu,
    user,
    selectedTab,
    setSelectedTab,
    limits,
    evaluators,
    selectedEvaluator,
    setSelectedEvaluator,
    newEvaluatorTitle,
    setNewEvaluatorTitle,
    newEvaluatorQuestionPapers,
    setNewEvaluatorQuestionPapers,
    newEvaluatorAnswerKeys,
    setNewEvaluatorAnswerKeys,
    classes,
    selectedClass,
    setSelectedClass,
    getEvaluators,
    getClasses,
    createEvaluator,
    deleteEvaluator,
    getStudents,
    newEvaluatorClassId,
    setNewEvaluatorClassId,
    setEditClassName,
    setEditClassSection,
    setEditClassSubject,
    editClassName,
    editClassSection,
    editClassSubject,
    editClass,
    createClass,
    deleteClass,
    newClassName,
    setNewClassName,
    newClassSection,
    setNewClassSection,
    newClassSubject,
    setNewClassSubject,
    editEvaluatorTitle,
    setEditEvaluatorTitle,
    editEvaluatorClassId,
    setEditEvaluatorClassId,
    editEvaluator,
  } = useContext(MainContext);

  const pathname = usePathname();
  const newClassModalRef = useRef<any | null>(null);

  useEffect(() => {
    getEvaluators();
    getClasses();

    pathname === "/home/classes" ? setSelectedTab(1) : setSelectedTab(0);

    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (selectedClass !== -1) {
      getStudents(classes[selectedClass]?._id);
    }
  }, [selectedClass]);

  const [initial, setInitial] = useState(true);
  useEffect(() => {
    if (initial) {
      setInitial(false);
      setSelectedEvaluator(parseInt(localStorage.getItem("selectedEvaluator") || "-1"));
    } else {
      localStorage.setItem("selectedEvaluator", selectedEvaluator.toString());
    }
  }, [selectedEvaluator]);

  return (
    <main className="flex bg-gray-100 h-screen w-screen p-4">
      <div className={`flex flex-col p-5 min-w-[275px] max-w-[15vw] h-full bg-white rounded-md ${!showMenu ? "max-sm:hidden" : "max-sm:fixed max-sm:w-full max-sm:h-full bg-opacity-90 z-50"}`}>
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <div className="text-xl font-bold text-indigo-600" onClick={() => setSelectedEvaluator(-1)}>
              🤖 {appName} 📝
            </div>
          </Link>
          <button className="max-sm:flex btn btn-secondary btn-sm" onClick={() => setShowMenu(false)}>
            <FiMoreHorizontal className="h-6 w-6" />
          </button>
        </div>
        <div role="tablist" className="tabs mb-2">
          <Link href="/home/evaluators" role="tab" onClick={() => { setSelectedTab(0); setSelectedClass(-1); setSelectedEvaluator(0) }}>
            <button className={`tab ${selectedTab === 0 ? "tab-active" : ""}`}>Evaluators</button>
          </Link>
          <Link href="/home/classes" role="tab" onClick={() => { setSelectedTab(1); setSelectedEvaluator(-1); setSelectedClass(0) }}>
            <button className={`tab ${selectedTab === 1 ? "tab-active" : ""}`}>Classes</button>
          </Link>
        </div>
        <button className="btn btn-primary mb-4" htmlFor={selectedTab === 0 && limits?.evaluatorLimit === 0 ? "limitexceed_modal" : ["newevaluator_modal", "newclass_modal"][selectedTab]}>
          <FiPlus /> NEW {["EVALUATOR", "CLASS"][selectedTab]}
        </button>
        <Link href="https://aiquiz.gradelab.io">
          <button className="btn btn-outline btn-success mb-4">🎓 AI Quiz</button>
        </Link>
        <div className="overflow-y-auto h-full mb-4">
          {selectedTab === 0 ? evaluators?.map((evaluator: any, i: number) => (
            <div key={i} className={`cursor-pointer flex flex-col px-3 py-2 rounded-md w-full mb-2 ${selectedEvaluator === i ? "bg-indigo-200" : "bg-transparent hover:bg-indigo-100"}`} onClick={() => {
                setSelectedEvaluator(i);
                setShowMenu(false);
                if (window.location.pathname !== "/home/evaluators") window.location.href = "/home/evaluators";
              }}>
              <div className="flex items-center">
                <FiFileText className="mr-2 text-indigo-600" />
                <div className="text-sm font-semibold text-gray-800">{evaluator.title}</div>
              </div>
              {selectedEvaluator === i && (
                <div className="flex mt-2 space-x-2">
                  <button className="flex-grow flex items-center justify-center bg-gray-600 text-white rounded-md p-2 hover:bg-gray-700" onClick={() => {
                      setEditEvaluatorTitle(evaluators[i].title);
                      setEditEvaluatorClassId(evaluators[i].classId);
                    }}>
                    <FiEdit /> <span className="ml-1 text-xs">Edit</span>
                  </button>
                  <button className="flex-grow flex items-center justify-center bg-red-600 text-white rounded-md p-2 hover:bg-red-700">
                    <FiTrash /> <span className="ml-1 text-xs">Delete</span>
                  </button>
                </div>
              )}
            </div>
          )) : classes?.map((_class: any, i: number) => (
            <div key={i} className={`cursor-pointer flex flex-col px-3 py-2 rounded-md w-full mb-2 ${selectedClass === i ? "bg-indigo-200" : "bg-transparent hover:bg-indigo-100"}`} onClick={() => setSelectedClass(i)}>
              <div className="flex items-center">
                <FiUsers className="mr-2 text-indigo-600" />
                <div>
                  <div className="text-sm font-semibold text-gray-800">{_class.subject}</div>
                  <div className="text-xs text-gray-600">{_class.name} {_class.section}</div>
                </div>
              </div>
              {selectedClass === i && (
                <div className="flex mt-2 space-x-2">
                  <button className="flex-grow flex items-center justify-center bg-gray-600 text-white rounded-md p-2 hover:bg-gray-700" onClick={() => {
                      setEditClassName(classes[i].name);
                      setEditClassSection(classes[i].section);
                      setEditClassSubject(classes[i].subject);
                    }}>
                    <FiEdit /> <span className="ml-1 text-xs">Edit</span>
                  </button>
                  <button className="flex-grow flex items-center justify-center bg-red-600 text-white rounded-md p-2 hover:bg-red-700">
                    <FiTrash /> <span className="ml-1 text-xs">Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <hr />
        <div className="flex justify-between items-center my-4">
          <p className="text-sm"><FiSettings className="mr-1" /> {limits?.evaluatorLimit} evaluators left</p>
          <Link href="/shop"><button className="btn btn-sm btn-secondary"><FiShoppingCart /> SHOP</button></Link>
        </div>
        {user?.type === 0 && (
          <Link href="/admin/dashboard">
            <button className="btn btn-outline btn-wide">
              <FiUser /> ADMIN PANEL <FiArrowRight />
            </button>
          </Link>
        )}
        <div className="dropdown dropdown-top flex items-center mt-auto cursor-pointer p-2 rounded-md hover:bg-indigo-100">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="avatar placeholder bg-indigo-600 text-white mask mask-squircle w-10">
                <span><FiUser /></span>
              </div>
              <p className="font-semibold ml-2">{user?.name}</p>
            </div>
            <FiMoreHorizontal />
          </div>
          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
            <Link href="/shop"><li className="flex"><FiShoppingCart /> Shop</li></Link>
            <Link href="/purchases"><li className="flex"><FiShoppingBag /> My Purchases</li></Link>
            <hr className="my-2" />
            <li className="flex" onClick={() => { localStorage.clear(); window.location.href = "/" }}>
              <FiLogOut className="text-red-600" /> Logout
            </li>
          </ul>
        </div>
      </div>
      {children}
    </main>
  );
}
