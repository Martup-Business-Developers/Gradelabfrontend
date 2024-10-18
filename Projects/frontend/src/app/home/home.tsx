"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { FiPlus, FiSettings, FiUser, FiLogOut, FiFileText, FiEdit, FiTrash, FiShoppingCart, FiArrowRight, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { appName } from "@/utils/utils";
import { UploadButton } from "@/utils/uploadthing";
import { MainContext } from "@/context/context";
import { usePathname } from "next/navigation";

export default function Home({ children }: { children: React.ReactNode }) {
  const {
    moreMenuOpen, setMoreMenuOpen, showMenu, setShowMenu, user,
    selectedTab, setSelectedTab, limits, evaluators, selectedEvaluator, 
    setSelectedEvaluator, newEvaluatorTitle, setNewEvaluatorTitle, 
    newEvaluatorQuestionPapers, setNewEvaluatorQuestionPapers, classes, 
    selectedClass, setSelectedClass, getEvaluators, getClasses, createEvaluator, 
    deleteEvaluator, getStudents, newEvaluatorClassId, setNewEvaluatorClassId,
    setEditClassName, setEditClassSection, setEditClassSubject, editClassName,
    editClassSection, editClassSubject, editClass, createClass, deleteClass, 
    newClassName, setNewClassName, newClassSection, setNewClassSection, 
    newClassSubject, setNewClassSubject, editEvaluatorTitle, setEditEvaluatorTitle, 
    editEvaluatorClassId, setEditEvaluatorClassId, editEvaluator
  } = useContext(MainContext);

  const pathname = usePathname();
  const newClassModalRef = useRef<any | null>(null);

  useEffect(() => {
    getEvaluators();
    getClasses();
    pathname === "/home/classes" ? setSelectedTab(1) : setSelectedTab(0);

    if (typeof window !== 'undefined' && !localStorage.getItem("token")) {
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
    <main className="flex flex-col lg:flex-row bg-base-100 h-screen w-screen p-2 max-sm:p-0">
      {/* Sidebar */}
      <div className={`flex flex-col p-5 min-w-[275px] max-w-[15vw] lg:max-w-[20vw] h-full rounded-md shadow-lg bg-white ${!showMenu ? "max-sm:hidden " : "fixed max-sm:w-full max-sm:h-full bg-base-100 z-50"}`}>
        <div className="flex justify-between items-center max-sm:mb-4">
          <Link href="/">
            <img src="https://gradelab.io/wp-content/uploads/2024/10/GradeLab-black.png" alt={`${appName} Logo`} className="h-10 max-sm:h-8 mb-4" />
          </Link>
          <button className="btn btn-square btn-sm max-sm:block hidden" onClick={() => setShowMenu(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="tabs flex flex-col space-y-3 mt-6 mb-4">
          <Link href="/home/evaluators" className={`tab ${selectedTab === 0 ? "tab-active" : ""}`} onClick={() => { setSelectedTab(0); setSelectedClass(-1); setSelectedEvaluator(0) }}>Evaluators</Link>
          <Link href="/home/classes" className={`tab ${selectedTab === 1 ? "tab-active" : ""}`} onClick={() => { setSelectedTab(1); setSelectedEvaluator(-1); setSelectedClass(0) }}>Classes</Link>
        </nav>
        <button className='btn btn-primary mt-auto'>
          <FiPlus /> New {["Evaluator", "Class"][selectedTab]}
        </button>
        <footer className="flex items-center justify-between mt-6">
          <p className="text-sm"><FiSettings className="mr-1" /> {limits?.evaluatorLimit} evaluators left</p>
          <Link href="/shop">
            <button className="btn btn-sm"><FiShoppingCart /> Shop</button>
          </Link>
        </footer>
        <div className="mt-4">
          {user?.type === 0 && (
            <Link href="/admin/dashboard">
              <button className="btn w-full flex justify-between"><FiUser /> Admin Panel <FiArrowRight /></button>
            </Link>
          )}
        </div>
        <div className="dropdown dropdown-top mt-4">
          <div className="flex items-center cursor-pointer">
            <div className="avatar placeholder">
              <div className="bg-blue-700 text-white mask mask-squircle w-10">
                <FiUser />
              </div>
            </div>
            <span className="ml-2 font-semibold">{user?.name}</span>
          </div>
          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box mt-2">
            <li><Link href="/shop"><FiShoppingCart /> Shop</Link></li>
            <li><Link href="/purchases"><FiShoppingCart /> My Purchases</Link></li>
            <li onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }} className="text-red-600"><FiLogOut /> Logout</li>
          </ul>
        </div>
      </div>
      
      {/* Main content */}
      <section className="flex-grow p-4 max-w-full bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-white shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Feature 1</h3>
            <p className="text-sm">Brief explanation about the feature or app section.</p>
          </div>
          <div className="card bg-white shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Feature 2</h3>
            <p className="text-sm">Brief explanation about the feature or app section.</p>
          </div>
          <div className="card bg-white shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Feature 3</h3>
            <p className="text-sm">Brief explanation about the feature or app section.</p>
          </div>
        </div>
      </section>
      {children}
    </main>
  );
}
