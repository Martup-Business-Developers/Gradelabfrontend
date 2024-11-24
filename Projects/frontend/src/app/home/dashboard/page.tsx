"use client";
import { useContext, useEffect } from 'react';
import { MainContext } from '@/context/context';
import { FiUsers, FiFileText, FiBook, FiTrendingUp } from 'react-icons/fi';

export default function DashboardPage() {
  const { evaluators, classes, getEvaluators, getClasses } = useContext(MainContext);

  useEffect(() => {
    getEvaluators();
    getClasses();
  }, []);

  const metrics = [
    {
      title: "Total Evaluators",
      value: evaluators?.length || 0,
      icon: FiFileText,
      color: "bg-blue-500"
    },
    {
      title: "Active Classes",
      value: classes?.length || 0,
      icon: FiUsers,
      color: "bg-green-500"
    },
    {
      title: "Total Subjects",
      value: new Set(classes?.map(c => c.subject)).size || 0,
      icon: FiBook,
      color: "bg-purple-500"
    },
    {
      title: "Monthly Evaluations",
      value: evaluators?.filter(e => {
        const date = new Date(e.createdAt);
        return date.getMonth() === new Date().getMonth();
      }).length || 0,
      icon: FiTrendingUp,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-semibold mt-1">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Recent Evaluators</h2>
          </div>
          <div className="divide-y">
            {evaluators?.slice(0, 5).map((evaluator: any, i: number) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{evaluator.title}</p>
                      <p className="text-sm text-gray-500">
                        {classes?.find(c => c._id === evaluator.classId)?.subject || 'No class assigned'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(evaluator.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Classes Overview</h2>
          </div>
          <div className="divide-y">
            {classes?.slice(0, 5).map((_class: any, i: number) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{_class.subject}</p>
                      <p className="text-sm text-gray-500">
                        {_class.name} {_class.section}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {evaluators?.filter(e => e.classId === _class._id).length || 0} evaluators
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}