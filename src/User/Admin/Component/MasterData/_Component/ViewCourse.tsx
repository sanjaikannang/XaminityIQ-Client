import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllCourses } from '../../../../../Services/Admin/adminAPI';

interface Course {
    _id: string;
    name: string;
    fullName: string;
    batchId: string;
    totalSemesters: number;
    durationYears: number;
    courseType: string;
    status: string;
}

const ViewCourse = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const response = await getAllCourses();
            if (response.success && response.data) {
                setCourses(response.data);
            } else {
                toast.error('Failed to load courses');
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white rounded-md shadow-xs border border-gray-300">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-full">
                                            <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-3"></div>
                                        </div>
                                        <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse ml-2"></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-semibold text-gray-900">All Courses</h1>                              
                            </div>
                        </div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">No courses found</div>
                            <div className="text-gray-400 text-sm">Start by adding your first course</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map((course) => (
                                <div key={course._id} className="bg-white rounded-md shadow-xs border border-gray-300 hover:scale-105 duration-300 hover:shadow-md">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                                                <p className="text-gray-600 text-sm">{course.fullName}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${course.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {course.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Course Type</span>
                                                <span className="font-medium text-gray-900">{course.courseType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Duration</span>
                                                <span className="font-medium text-gray-900">{course.durationYears} Years</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Semesters</span>
                                                <span className="font-medium text-gray-900">{course.totalSemesters}</span>
                                            </div>
                                        </div>                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewCourse;