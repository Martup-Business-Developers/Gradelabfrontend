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
    <main className="flex bg-gray-100 h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-5 shadow-lg flex flex-col justify-between">
        <div>
          <Link href="/">
            <div className="flex items-center mb-6">
              <div className="text-2xl font-bold text-purple-600">🤖 {appName}</div>
            </div>
          </Link>
          <nav className="flex flex-col space-y-4">
            <Link href="/home/evaluators">
              <button
                className={`flex items-center text-lg ${
                  selectedTab === 0 ? "text-purple-600" : "text-gray-600"
                }`}
                onClick={() => {
                  setSelectedTab(0);
                  setSelectedClass(-1);
                  setSelectedEvaluator(0);
                }}
              >
                <FiFileText className="mr-2" />
                Evaluators
              </button>
            </Link>
            <Link href="/home/classes">
              <button
                className={`flex items-center text-lg ${
                  selectedTab === 1 ? "text-purple-600" : "text-gray-600"
                }`}
                onClick={() => {
                  setSelectedTab(1);
                  setSelectedEvaluator(-1);
                  setSelectedClass(0);
                }}
              >
                <FiUsers className="mr-2" /> Classes
              </button>
            </Link>
          </nav>
        </div>
        <div>
          <Link href="https://aiquiz.gradelab.io">
            <button className="w-full mb-4 p-2 bg-green-500 text-white rounded-md text-left">
              🎓 AI Quiz
            </button>
          </Link>
          <button
            className="w-full mb-4 p-2 bg-blue-500 text-white rounded-md text-left"
            onClick={() => {
              if (selectedTab === 0 && limits?.evaluatorLimit === 0) {
                alert("Evaluator limit exceeded!");
              } else {
                const modal = selectedTab === 0 ? "newevaluator_modal" : "newclass_modal";
                document.getElementById(modal)?.click();
              }
            }}
          >
            <FiPlusCircle className="mr-2" />
            New {selectedTab === 0 ? "Evaluator" : "Class"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex-grow bg-gray-200 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Home Page</h1>
          <input
            type="search"
            placeholder="Search..."
            className="w-1/3 py-2 px-4 rounded-lg border border-gray-300"
          />
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow p-4 rounded-lg">Dashboard Item 1</div>
          <div className="bg-white shadow p-4 rounded-lg">Dashboard Item 2</div>
          <div className="bg-white shadow p-4 rounded-lg">Dashboard Item 3</div>
          <div className="col-span-2 bg-white shadow p-4 rounded-lg">Dashboard Item 4</div>
          <div className="bg-white shadow p-4 rounded-lg">Dashboard Item 5</div>
        </div>
      </section>

      {/* Modals Here */}
      {/* Add modals for New Evaluator, New Class, Edit Evaluator, Edit Class, etc. */}
    </main>
  );
}
