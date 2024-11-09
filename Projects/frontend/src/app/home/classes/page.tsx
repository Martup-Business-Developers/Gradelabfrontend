"use client";
import { useContext, useState, useRef } from "react";
import { FiUser, FiEdit, FiTrash, FiPlusCircle, FiUsers, FiBook, FiHash, FiPrinter, FiMail, FiUpload, FiDownload } from "react-icons/fi";
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

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importError, setImportError] = useState("");
  
  // Function to download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = `Roll No,Name,Email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com
3,Bob Wilson,bob@example.com`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'sample_students.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setImportError("");
    } else {
      setImportError("Please select a valid CSV file");
      setSelectedFile(null);
    }
  };

  // Function to handle importing students from CSV
  const handleImportStudents = () => {
    if (!selectedFile) {
      setImportError("Please select a CSV file first");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [rollNo, name, email] = line.split(',').map(item => item.trim());
            
            if (rollNo && name && email) {
              setNewStudentRollNo(parseInt(rollNo));
              setNewStudentName(name);
              setNewStudentEmail(email);
              const success = addStudent();

              if (!success) {
                throw new Error(`Failed to add student with Roll No: ${rollNo}`);
              }
            }
          }
        }
        
        // Reset file input and state
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        alert("Students imported successfully!");
        
      } catch (error) {
        console.error("Error importing students:", error);
        setImportError("Error processing CSV file. Please check the format and try again.");
      }
    };

    reader.onerror = () => {
      setImportError("Error reading the file. Please try again.");
    };

    reader.readAsText(selectedFile);
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
              students.map((student, i) => (
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

      {/* Modals (Import, New, Edit, Delete) */}
      <input type="checkbox" id="import_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiUpload className="mr-1" /> Import Students</h3>
          <div className="mt-4 mb-6">
            <button className="btn btn-outline btn-sm" onClick={downloadSampleCSV}>
              <FiDownload className="mr-2" /> Download Sample CSV
            </button>
          </div>
          <div className="py-4">
            <p className="text-sm opacity-80 mb-2">Upload a CSV file with columns for Roll No, Name, and Email.</p>
            <input
              ref={fileInputRef}
              type="file"
              className="file-input w-full max-w-xs"
              accept=".csv"
              onChange={handleFileSelect}
            />
            {importError && <p className="text-error mt-2">{importError}</p>}
          </div>
          <div className="modal-action">
            <label htmlFor="import_modal" className="btn btn-primary" onClick={handleImportStudents}>Import</label>
            <label htmlFor="import_modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </div>
  );
}
