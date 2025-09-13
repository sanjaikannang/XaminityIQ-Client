import {
  Users,
  Clock,
  CheckCircle,
  Calendar,
  FileText,
  BookOpen,
  Building2,
  Layers,
  Plus,
  Upload,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {

  const statsCards = [
    {
      title: 'Total Batches',
      count: '2,847',
      icon: Users,
      description: 'Active student batches'
    },
    {
      title: 'Total Courses',
      count: '2,847',
      icon: BookOpen,
      description: 'Available courses'
    },
    {
      title: 'Total Branches',
      count: '2,847',
      icon: Building2,
      description: 'Department branches'
    },
    {
      title: 'Total Sections',
      count: '2,847',
      icon: Layers,
      description: 'Class sections'
    },
  ]

  const examStats = [
    {
      title: 'Ongoing Exams',
      value: '12',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Completed Exams',
      value: '156',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Upcoming Exams',
      value: '28',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Pending Results',
      value: '8',
      icon: FileText,
      color: 'text-red-600 bg-red-50'
    }
  ];

  const recentExams = [
    {
      id: 1,
      course: 'Computer Science',
      subject: 'Data Structures',
      batch: 'CSE-2024-A',
      date: '2025-09-10',
      time: '10:00 AM',
      duration: '2h 30m',
      participants: 45,
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      course: 'Information Technology',
      subject: 'Database Management',
      batch: 'IT-2024-B',
      date: '2025-09-12',
      time: '2:00 PM',
      duration: '3h 00m',
      participants: 38,
      status: 'Ongoing',
      statusColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 3,
      course: 'Electronics',
      subject: 'Digital Circuits',
      batch: 'ECE-2024-A',
      date: '2025-09-15',
      time: '9:00 AM',
      duration: '2h 00m',
      participants: 52,
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  const resultPublishing = [
    {
      exam: 'Data Structures Mid-term',
      course: 'CSE',
      date: '2025-09-08',
      totalStudents: 45,
      evaluated: 45,
      published: 45,
      pending: 0,
      status: 'Published'
    },
    {
      exam: 'DBMS Final Exam',
      course: 'IT',
      date: '2025-09-10',
      totalStudents: 38,
      evaluated: 30,
      published: 0,
      pending: 38,
      status: 'Evaluating'
    },
    {
      exam: 'Network Security Quiz',
      course: 'CSE',
      date: '2025-09-11',
      totalStudents: 42,
      evaluated: 42,
      published: 0,
      pending: 42,
      status: 'Ready to Publish'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {/* Main Statistics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-md shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-md ml-4">
                    <stat.icon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Statistics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Exam Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-md shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-md ml-4 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Exams Section */}
          <div className="lg:col-span-2 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">Recent Exams</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course/Subject</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{exam.subject}</div>
                          <div className="text-sm text-gray-500">{exam.course}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{exam.batch}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{exam.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{exam.participants}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${exam.statusColor}`}>
                          {exam.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">Schedule New Exam</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                <div className="p-2 bg-green-100 rounded-md">
                  <Upload className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Publish Results</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                <div className="p-2 bg-purple-100 rounded-md">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">Manage Students</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200">
                <div className="p-2 bg-amber-100 rounded-md">
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                </div>
                <span className="font-medium text-gray-900">View Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Result Publishing Status Section */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900">Result Publishing Status</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Date</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluated</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resultPublishing.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{result.exam}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-700">{result.course}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{result.date}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{result.totalStudents}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{result.evaluated}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{result.published}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${result.status === 'Published' ? 'bg-green-100 text-green-800' :
                        result.status === 'Ready to Publish' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;