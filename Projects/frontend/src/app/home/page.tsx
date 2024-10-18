"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [classes, setClasses] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all the data from your API routes
        const [userRes, evalRes, classRes, adminRes, faqRes] = await Promise.all([
          axios.get("https://api.gradelab.io/users"),
          axios.get("https://api.gradelab.io/evaluate"),
          axios.get("https://api.gradelab.io/class"),
          axios.get("https://api.gradelab.io/admin"),
          axios.get("https://api.gradelab.io/faq"),
        ]);

        // Set data for each section
        setUsers(userRes.data);
        setEvaluations(evalRes.data);
        setClasses(classRes.data);
        setAdmins(adminRes.data);
        setFaqs(faqRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="select-none w-full h-full p-8">
      {/* Dashboard header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-semibold">📊 Dashboard</h1>
        <p className="text-lg opacity-70">Welcome back! Here are your latest insights.</p>
      </div>

      {/* Users display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-base-300 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">👤 {user.name}</h3>
              <p className="text-sm opacity-70">Email: {user.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluations display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Evaluations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluations.map((evaluation) => (
            <div key={evaluation._id} className="bg-base-300 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">📄 {evaluation.title}</h3>
              <p className="text-sm opacity-70">Date: {new Date(evaluation.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classes display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Classes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem._id} className="bg-base-300 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">🏫 {classItem.name}</h3>
              <p className="text-sm opacity-70">Section: {classItem.section}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admins display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div key={admin._id} className="bg-base-300 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">👨‍💼 {admin.name}</h3>
              <p className="text-sm opacity-70">Role: {admin.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs display */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-base-300 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">❓ {faq.question}</h3>
              <p className="text-sm opacity-70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
