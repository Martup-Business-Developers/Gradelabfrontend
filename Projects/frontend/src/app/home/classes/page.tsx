"use client";
import { useContext, useState } from "react";
import { FiUser, FiEdit, FiTrash, FiPlusCircle, FiUsers, FiBook, FiHash, FiPrinter, FiMail, FiUpload } from "react-icons/fi";
import { MainContext } from "@/context/context";
import { appName } from "@/utils/utils";

export default function Classes() {
  const {
    setSelectedEvaluator,
    classes,
    selectedClass,
    students,
    newStudentName,
    setNewStudentName,
    newStudentRollNo,
    setNewStudentRollNo,
    newStudentEmail,
    setNewStudentEmail,
    setDeleteStudentRollNo,
    addStudent,
    deleteStudent,
    editStudentRollNo,
    setEditStudentRollNo,
    editStudentName,
    setEditStudentName,
    editStudentEmail,
    setEditStudentEmail,
    editStudent
  } = useContext(MainContext);

  // New state for import modal
  const [importData, setImportData] = useState("");
  
  // Function to handle importing students
  const handleImportStudents = () => {
    try {
      // Split the pasted data by newlines
      const lines = importData.trim().split('\n');
      
      // Process each line
      lines.forEach(line => {
        // Split line by tabs or commas
        const [rollNo, name, email] = line.split(/[,\t]/).map(item => item.trim());
        
        // Validate data
        if (rollNo && name && email) {
          // Set the student details
          setNewStudentRollNo(parseInt(rollNo));
          setNewStudentName(name);
          setNewStudentEmail(email);
          
          // Add the student
          addStudent();
        }
      });
      
      // Clear the import data
      setImportData("");
      
      // Show success message
      alert("Students imported successfully!");
      
    } catch (error) {
      console.error("Error importing students:", error);
      alert("Error importing students. Please check the format and try again.");
    }
  };

  return (
    classes.length === 0 ? <div className="animate-fade-in-bottom flex flex-col w-full max-sm:max-w-none">
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
    </div> : <div className="animate-fade-in-bottom flex flex-col w-full max-w-[50vw] max-sm:max-w-none">
      <div className="hidden max-sm:flex justify-end mb-3">
        <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex items-center justify-between mb-1 mt-4 w-full max-w-lg">
        <p className="flex items-center font-semibold text-xl"><FiBook className="mr-2" /> {classes[selectedClass]?.subject} <FiUsers className="ml-5 mr-2" /> {classes[selectedClass]?.name} {classes[selectedClass]?.section}</p>
      </div>
      <div className="print flex mt-5 gap-2">
        <label htmlFor="newstudent_modal" className="btn btn-primary" onClick={() => setNewStudentRollNo(students.length + 1)}>+ New Student</label>
        <label htmlFor="import_modal" className="btn btn-secondary"><FiUpload className="mr-2" /> Import Students</label>
      </div>
      <div className="overflow-y-auto h-[70vh] mt-5">
        <div className='print flex w-full items-center max-w-7xl py-5'>
          <button className='btn btn-primary' onClick={() => window.print()}><FiPrinter />Download / Print</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>RollNo</th>
              <th>Name</th>
              <th>Email</th>
              <th className="print">Edit</th>
              <th className="print">Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              students.map((student: any, i: any) => (
                <tr key={i}>
                  <th>{student?.rollNo}</th>
                  <td>{student?.name}</td>
                  <td>{student?.email}</td>
                  <td className="print"><label htmlFor="editstudent_modal" className="btn btn-square" onClick={() => {
                    setEditStudentRollNo(student.rollNo);
                    setEditStudentName(student.name);
                    setEditStudentEmail(student.email);
                  }}><FiEdit /></label></td>
                  <td className="print"><label htmlFor="deletestudent_modal" className="btn btn-square" onClick={() => setDeleteStudentRollNo(student.rollNo)}><FiTrash /></label></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Import Students Modal */}
      <input type="checkbox" id="import_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiUpload className="mr-1" /> Import Students</h3>
          <p className="py-4">Paste student data below (Format: Roll No, Name, Email - one student per line)</p>
          <textarea 
            className="textarea textarea-bordered w-full h-48"
            placeholder="1, John Doe, john@example.com&#13;2, Jane Smith, jane@example.com"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
          />
          <div className="modal-action">
            <label htmlFor="import_modal" className="btn">Cancel</label>
            <label htmlFor="import_modal" className="btn btn-primary" onClick={handleImportStudents}>Import</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="import_modal">Cancel</label>
      </div>

      {/* New Student Modal */}
      <input type="checkbox" id="newstudent_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Student</h3>
          <p className="flex items-center py-4"><FiHash className='mr-2' />Roll No</p>
          <input className="input input-bordered w-full" placeholder="Roll No" type="number" onChange={(x) => setNewStudentRollNo(parseInt(x.target.value))} value={newStudentRollNo} />
          <p className="flex items-center py-4"><FiUser className='mr-2' />Student Name</p>
          <input className="input input-bordered w-full" placeholder="Student Name" type="text" onChange={(x) => setNewStudentName(x.target.value)} value={newStudentName} />
          <p className="flex items-center py-4"><FiMail className='mr-2' />Email</p>
          <input className="input input-bordered w-full" placeholder="Email" type="email" onChange={(x) => setNewStudentEmail(x.target.value)} value={newStudentEmail} />
          <div className="modal-action">
            <label htmlFor="newstudent_modal" className="btn">Cancel</label>
            <label htmlFor="newstudent_modal" className="btn btn-primary" onClick={() => addStudent()}>Add Student</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="newstudent_modal">Cancel</label>
      </div>

      {/* Delete Student Modal */}
      <input type="checkbox" id="deletestudent_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete Student</h3>
          <p className="py-4">Are you sure want to delete this student?</p>
          <div className="modal-action">
            <label htmlFor="deletestudent_modal" className="btn">Cancel</label>
            <label htmlFor="deletestudent_modal" className="btn btn-error" onClick={() => deleteStudent()}>Delete</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="deletestudent_modal">Cancel</label>
      </div>

      {/* Edit Student Modal */}
      <input type="checkbox" id="editstudent_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiEdit className="mr-1" /> Edit Student</h3>
          <p className="flex items-center py-4"><FiHash className='mr-2' />Roll No</p>
          <p className="flex items-center py-4">{editStudentRollNo}</p>
          <p className="flex items-center py-4"><FiUser className='mr-2' />Student Name</p>
          <input className="input input-bordered w-full" placeholder="Student Name" type="text" onChange={(x) => setEditStudentName(x.target.value)} value={editStudentName} />
          <p className="flex items-center py-4"><FiMail className='mr-2' />Email</p>
          <input className="input input-bordered w-full" placeholder="Email" type="email" onChange={(x) => setEditStudentEmail(x.target.value)} value={editStudentEmail} />
          <div className="modal-action">
            <label htmlFor="editstudent_modal" className="btn">Cancel</label>
            <label htmlFor="editstudent_modal" className="btn btn-primary" onClick={() => editStudent()}>Save Changes</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="editstudent_modal">Cancel</label>
      </div>
    </div>
  );
}
