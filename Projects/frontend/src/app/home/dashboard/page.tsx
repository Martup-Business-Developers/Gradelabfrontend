"use client";
import { useContext, useEffect } from 'react';
import { MainContext } from '@/context/context';
import { 
  FiUsers, 
  FiFileText, 
  FiBook, 
  FiTrendingUp, 
  FiClock, 
  FiCalendar,
  FiActivity 
} from 'react-icons/fi';

const MetricCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ title, subtitle, time, icon: Icon = FiActivity }: any) => (
  <div className="p-4 hover:bg-gray-50 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  </div>
);

const RecentActivity = ({ title, items, icon }: any) => (
  <div className="card">
    <div className="border-b p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="divide-y">
      {items.map((item: any, i: number) => (
        <ActivityItem key={i} {...item} icon={icon} />
      ))}
    </div>
  </div>
);

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
          <MetricCard key={i} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          title="Recent Evaluators"
          icon={FiFileText}
          items={evaluators?.slice(0, 5).map((e: any) => ({
            title: e.title,
            subtitle: classes?.find((c: any) => c._id === e.classId)?.subject || 'No class assigned',
            time: new Date(e.createdAt).toLocaleDateString()
          })) || []}
        />
        <RecentActivity 
          title="Recent Classes"
          icon={FiUsers}
          items={classes?.slice(0, 5).map((c: any) => ({
            title: c.subject,
            subtitle: `${c.name} ${c.section}`,
            time: `${evaluators?.filter(e => e.classId === c._id).length || 0} evaluators`
          })) || []}
        />
      </div>
    </div>
  );
}
