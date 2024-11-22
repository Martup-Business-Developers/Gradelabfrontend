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
    classes,
    selectedClass,
    setSelectedClass,
    getEvaluators,
    getClasses,
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

  return (
    <main
      className="flex bg-gray-50 h-screen w-screen p-4 max-sm:p-0"
      onClick={() => moreMenuOpen && setMoreMenuOpen(false)}
    >
      {/* Sidebar */}
      <div
        className={`flex flex-col p-5 min-w-[275px] max-w-[15vw] h-full rounded-lg bg-white shadow-md ${
          !showMenu
            ? "max-sm:hidden"
            : "max-sm:fixed max-sm:w-full max-sm:h-full max-sm:max-w-none z-50"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <Link href="/">
            <div
              className="text-xl font-bold text-blue-600"
              onClick={() => setSelectedEvaluator(-1)}
            >
              🤖 {appName}
            </div>
          </Link>
          <button
            className="btn btn-circle btn-outline hidden max-sm:block"
            onClick={() => setShowMenu(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs tabs-boxed mt-6 mb-4">
          <Link
            href="/home/evaluators"
            className={`tab ${selectedTab === 0 ? "tab-active" : ""}`}
            onClick={() => {
              setSelectedTab(0);
              setSelectedEvaluator(0);
            }}
          >
            Evaluators
          </Link>
          <Link
            href="/home/classes"
            className={`tab ${selectedTab === 1 ? "tab-active" : ""}`}
            onClick={() => {
              setSelectedTab(1);
              setSelectedClass(0);
            }}
          >
            Classes
          </Link>
        </div>

        {/* New Item Button */}
        <label
          htmlFor={
            selectedTab === 0 && limits?.evaluatorLimit === 0
              ? "limitexceed_modal"
              : "new_modal"
          }
          className="btn btn-primary btn-block"
        >
          <FiPlus className="mr-2" />
          New {["Evaluator", "Class"][selectedTab]}
        </label>

        {/* List of Evaluators or Classes */}
        <div className="overflow-y-auto mt-4">
          {selectedTab === 0
            ? evaluators?.map((evaluator: any, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-md cursor-pointer ${
                    selectedEvaluator === i
                      ? "bg-blue-50 border-blue-500 border"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedEvaluator(i)}
                >
                  <div className="flex items-center">
                    <FiFileText className="mr-2 text-blue-500" />
                    <span>{evaluator.title}</span>
                  </div>
                </div>
              ))
            : classes?.map((class_: any, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-md cursor-pointer ${
                    selectedClass === i
                      ? "bg-blue-50 border-blue-500 border"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedClass(i)}
                >
                  <div className="flex items-center">
                    <FiUsers className="mr-2 text-green-500" />
                    <div>
                      <p className="font-semibold">{class_.subject}</p>
                      <p className="text-sm text-gray-500">
                        {class_.name} {class_.section}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* AI Quiz Button */}
        <Link href="https://aiquiz.gradelab.io">
          <button className="btn btn-outline btn-success mt-6 w-full">
            🎓 AI Quiz
          </button>
        </Link>

        {/* Footer */}
        <div className="mt-auto text-center text-gray-500 text-sm">
          Powered by GradeLab
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">{children}</div>
    </main>
  );
}
