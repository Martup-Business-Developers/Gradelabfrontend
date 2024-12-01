import { useContext, useEffect, useRef, useState } from "react";
import { FiPlus, FiMoreHorizontal, FiSettings, FiUser, FiLogOut, FiFileText, FiEdit, FiTrash, FiArrowRight, FiShoppingCart, FiShoppingBag, FiType, FiPlusCircle, FiKey, FiUsers, FiBook, FiInfo } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { appName } from "@/utils/utils";
import { UploadButton } from "@/utils/uploadthing";
import { MainContext } from "@/context/context";

export default function Home({
  children,
}: {
  children: React.ReactNode
}) {
  const location = useLocation();
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
    editEvaluator } = useContext(MainContext);

  const newClassModalRef = useRef<any | null>(null);

  useEffect(() => {
    getEvaluators();
    getClasses();

    location.pathname === "/home/classes" ? setSelectedTab(1) : setSelectedTab(0);

    if (typeof window !== 'undefined') {
      if (!localStorage.getItem("token")) {
        window.location.href = "/login";
      }
    }
  }, [location.pathname]);

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
    }
    else {
      localStorage.setItem("selectedEvaluator", selectedEvaluator.toString());
    }
  }, [selectedEvaluator]);

  return (
    <main className="flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen w-screen p-4 max-sm:p-2" onClick={() => {
      if (moreMenuOpen) setMoreMenuOpen(false);
    }}>
      {/* Sidebar */}
      <div className={`print flex flex-col p-6 min-w-[300px] max-w-[20vw] h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ${!showMenu ? "max-sm:hidden" : "max-sm:fixed max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:z-50"}`}>
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt={appName} className="w-10 h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {appName}
            </span>
          </Link>
          <button 
            className="hidden max-sm:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowMenu(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
          <Link 
            to="/home/evaluators"
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md text-center transition-colors ${selectedTab === 0 ? "bg-white dark:bg-gray-800 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600"}`}
            onClick={() => { setSelectedTab(0); setSelectedClass(-1); setSelectedEvaluator(0) }}
          >
            Evaluators
          </Link>
          <Link 
            to="/home/classes"
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md text-center transition-colors ${selectedTab === 1 ? "bg-white dark:bg-gray-800 shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600"}`}
            onClick={() => { setSelectedTab(1); setSelectedEvaluator(-1); setSelectedClass(0) }}
          >
            Classes
          </Link>
        </div>

        {/* New Button */}
        <label 
          ref={newClassModalRef}
          className="btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg py-3 px-4 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300"
          htmlFor={selectedTab === 0 && limits?.evaluatorLimit === 0 ? "limitexceed_modal" : ["newevaluator_modal", "newclass_modal"][selectedTab]}
        >
          <FiPlus className="w-5 h-5" />
          <span>NEW {["EVALUATOR", "CLASS"][selectedTab]}</span>
        </label>

        {/* List Section */}
        <div className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
          {selectedTab === 0 ? (
            <div className="space-y-2">
              {evaluators?.map((evaluator: any, i: number) => (
                <div
                  key={i}
                  className={`group p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedEvaluator === i 
                      ? "bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedEvaluator(i);
                    setShowMenu(false);
                    if (window.location.pathname !== "/home/evaluators") {
                      window.location.href = "/home/evaluators";
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <FiFileText className="w-5 h-5 text-blue-500" />
                    <span className="flex-1 font-medium truncate">{evaluator.title}</span>
                  </div>
                  
                  {selectedEvaluator === i && (
                    <div className="flex mt-3 space-x-2">
                      <label
                        htmlFor="editevaluator_modal"
                        className="flex items-center justify-center flex-1 px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        onClick={() => {
                          setEditEvaluatorTitle(evaluators[i].title);
                          setEditEvaluatorClassId(evaluators[i].classId);
                        }}
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit
                      </label>
                      <label
                        htmlFor="deleteevaluator_modal"
                        className="flex items-center justify-center flex-1 px-3 py-2 text-sm rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <FiTrash className="w-4 h-4 mr-2" />
                        Delete
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {classes?.map((_class: any, i: number) => (
                <div
                  key={i}
                  className={`group p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedClass === i 
                      ? "bg-purple-50 dark:bg-gray-700 border-l-4 border-purple-500" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => { setSelectedClass(i); setShowMenu(false) }}
                >
                  <div className="flex items-center space-x-3">
                    <FiUsers className="w-5 h-5 text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{_class.subject}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{_class.name} {_class.section}</p>
                    </div>
                  </div>
                  
                  {selectedClass === i && (
                    <div className="flex mt-3 space-x-2">
                      <label
                        htmlFor="editclass_modal"
                        className="flex items-center justify-center flex-1 px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                        onClick={() => {
                          setEditClassName(classes[i].name);
                          setEditClassSection(classes[i].section);
                          setEditClassSubject(classes[i].subject);
                        }}
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit
                      </label>
                      <label
                        htmlFor="deleteclass_modal"
                        className="flex items-center justify-center flex-1 px-3 py-2 text-sm rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <FiTrash className="w-4 h-4 mr-2" />
                        Delete
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FiSettings className="w-4 h-4 mr-2" />
              <span>{limits?.evaluatorLimit} evaluators left</span>
            </div>
            <Link 
              to="/shop"
              className="px-3 py-1 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-colors"
            >
              <FiShoppingCart className="inline-block w-4 h-4 mr-1" />
              Shop
            </Link>
          </div>

          {user?.type === 0 && (
            <Link to="/admin/dashboard">
              <button className="w-full mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-between">
                <span className="flex items-center">
                  <FiUser className="w-4 h-4 mr-2" />
                  Admin Panel
                </span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}

          <div className="relative">
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <FiUser className="w-5 h-5" />
                </div>
                <span className="font-medium">{user?.name}</span>
              </div>
              <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
            </div>

            {moreMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Link to="/shop">
                  <div className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FiShoppingCart className="w-4 h-4" />
                    <span>Shop</span>
                  </div>
                </Link>
                <Link to="/purchases">
                  <div className="flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FiShoppingBag className="w-4 h-4" />
                    <span>My Purchases</span>
                  </div>
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700" />
                <div 
                  className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-6 max-sm:ml-0">
        {children}
      </div>

      {/* New Evaluator Modal */}
      <input type="checkbox" id="newevaluator_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Evaluator</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Title</p>
          <input className="input input-bordered w-full" placeholder="What's the name of the exam / evaluator?" type="text" onChange={(x) => setNewEvaluatorTitle(x.target.value)} value={newEvaluatorTitle} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Class</p>
          {classes?.length === 0 ? <div role="alert" className="alert shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 className="font-bold">No Classes!</h3>
              <div className="text-xs">You need to create a class to proceed.</div>
            </div>
            <label htmlFor="newevaluator_modal" onClick={() => { newClassModalRef.current.click(); }} className="btn btn-primary btn-sm">Create Class</label>
          </div> : <select className="select select-bordered w-full" value={newEvaluatorClassId} onChange={(x) => setNewEvaluatorClassId(x.target.value)}>
            <option disabled value={"-1"}>Select class</option>
            {
              classes?.map((class_: any, i: any) => (
                <option key={i} value={class_._id}>{class_?.subject} | {class_?.name} {class_?.section}</option>
              ))
            }
          </select>}
          <p className="flex items-center py-4"><FiFileText className='mr-2' />Upload question paper(s)</p>
          {newEvaluatorQuestionPapers.length > 0 ?
            <div className="flex flex-wrap">{
              newEvaluatorQuestionPapers.map((file: string, i: number) => {
                return <img key={i} src={file} className="border cursor-pointer w-20 h-20 object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
              })
            }</div>
            : <div className="flex">
              <UploadButton
                endpoint="media"
                onClientUploadComplete={(res) => {
                  var files = [];
                  for (const file of res) {
                    files.push(file.url);
                  }
                  setNewEvaluatorQuestionPapers([...files]);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>}
          <p className="flex items-center py-4"><FiKey className='mr-2' />Upload answer key / criteria</p>
          {newEvaluatorAnswerKeys.length > 0 ?
            <div className="flex flex-wrap">{
              newEvaluatorAnswerKeys.map((file: string, i: number) => {
                return <img key={i} src={file} className="border cursor-pointer w-20 h-20 object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
              })
            }</div>
            : <div className="flex">
              <UploadButton
                endpoint="media"
                onClientUploadComplete={(res) => {
                  var files = [];
                  for (const file of res) {
                    files.push(file.url);
                  }
                  setNewEvaluatorAnswerKeys([...files]);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>}
          <div className="modal-action">
            <label htmlFor="newevaluator_modal" className="btn">Cancel</label>
            <label htmlFor="newevaluator_modal" className="btn btn-primary" onClick={() => createEvaluator()}>Create Evaluator</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="newevaluator_modal">Cancel</label>
      </div>
      {/* Edit Evaluator Modal */}
      <input type="checkbox" id="editevaluator_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> Edit Evaluator</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Title</p>
          <input className="input input-bordered w-full" placeholder="What's the name of the exam / evaluator?" type="text" onChange={(x) => setEditEvaluatorTitle(x.target.value)} value={editEvaluatorTitle} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Class</p>
          <select className="select select-bordered w-full" value={editEvaluatorClassId} onChange={(x) => setEditEvaluatorClassId(x.target.value)}>
            <option disabled value={"-1"}>Select class</option>
            {
              classes?.map((class_: any, i: any) => (
                <option key={i} value={class_._id}>{class_?.subject} | {class_?.name} {class_?.section}</option>
              ))
            }
          </select>
          <div className="modal-action">
            <label htmlFor="editevaluator_modal" className="btn">Cancel</label>
            <label htmlFor="editevaluator_modal" className="btn btn-primary" onClick={() => editEvaluator()}>Save</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="editevaluator_modal">Cancel</label>
      </div>
      {/* Delete Evaluator Modal */}
      <input type="checkbox" id="deleteevaluator_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete Evaluator</h3>
          <p className="py-4">Are you sure want to delete this evaluator?</p>
          <div className="modal-action">
            <label htmlFor="deleteevaluator_modal" className="btn">Cancel</label>
            <label htmlFor="deleteevaluator_modal" className="btn btn-error" onClick={() => deleteEvaluator()}>Delete</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="deleteevaluator_modal">Cancel</label>
      </div>
      {/* Evaluator Limit Exceed Modal */}
      <input type="checkbox" id="limitexceed_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiInfo className="mr-1" /> Evaluator limit exceeded</h3>
          <p className="py-4">You have reached the maximum limit of evaluators.<br />You can shop for more evaluators or delete existing ones to create new ones.</p>
          <div className="modal-action">
            <label htmlFor="limitexceed_modal" className="btn">Cancel</label>
            <label htmlFor="limitexceed_modal" className="btn btn-primary" onClick={() => window.location.href = "/shop"}><FiShoppingCart /> Shop</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="limitexceed_modal">Cancel</label>
      </div>
      {/* New Class Modal */}
      <input type="checkbox" id="newclass_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Class</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Class Name</p>
          <input className="input input-bordered w-full" placeholder="Class Name" type="text" onChange={(x) => setNewClassName(x.target.value)} value={newClassName} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Section</p>
          <input className="input input-bordered w-full" placeholder="Section" type="text" onChange={(x) => setNewClassSection(x.target.value)} value={newClassSection} />
          <p className="flex items-center py-4"><FiBook className='mr-2' />Subject</p>
          <input className="input input-bordered w-full" placeholder="Subject" type="text" onChange={(x) => setNewClassSubject(x.target.value)} value={newClassSubject} />
          <div className="modal-action">
            <label htmlFor="newclass_modal" className="btn">Cancel</label>
            <label htmlFor="newclass_modal" className="btn btn-primary" onClick={() => createClass()}>Create Class</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="newclass_modal">Cancel</label>
      </div>
      {/* Delete Class Modal */}
      <input type="checkbox" id="deleteclass_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete Class</h3>
          <p className="py-4">Are you sure want to delete this class?</p>
          <div className="modal-action">
            <label htmlFor="deleteclass_modal" className="btn">Cancel</label>
            <label htmlFor="deleteclass_modal" className="btn btn-error" onClick={() => deleteClass()}>Delete</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="deleteclass_modal">Cancel</label>
      </div>
      {/* Edit Class Modal */}
      <input type="checkbox" id="editclass_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiEdit className="mr-1" /> Edit Class</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Class Name</p>
          <input className="input input-bordered w-full" placeholder="Class Name" type="text" onChange={(x) => setEditClassName(x.target.value)} value={editClassName} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Section</p>
          <input className="input input-bordered w-full" placeholder="Section" type="text" onChange={(x) => setEditClassSection(x.target.value)} value={editClassSection} />
          <p className="flex items-center py-4"><FiBook className='mr-2' />Subject</p>
          <input className="input input-bordered w-full" placeholder="Subject" type="text" onChange={(x) => setEditClassSubject(x.target.value)} value={editClassSubject} />
          <div className="modal-action">
            <label htmlFor="editclass_modal" className="btn">Cancel</label>
            <label htmlFor="editclass_modal" className="btn btn-primary" onClick={() => editClass()}>Save</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="editclass_modal">Cancel</label>
      </div>
    </main >
  );
}
