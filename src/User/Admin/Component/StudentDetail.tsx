import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetStudentResponse } from '../../../Types/admin.types';
import { setSelectedStudent, setStudentError, setStudentLoading } from '../../../State/Slices/adminSlice';
import { getStudent } from '../../../Services/Admin/adminAPI';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [studentData, setStudentData] = useState<GetStudentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student details
  const fetchStudentDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      dispatch(setStudentLoading(true));

      const response = await getStudent(id);
      setStudentData(response);

      // Update Redux state if needed
      if (response.success && response.data.students.length > 0) {
        dispatch(setSelectedStudent(response.data.students[0]));
      }

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch student details';
      setError(errorMessage);
      dispatch(setStudentError(errorMessage));
    } finally {
      setLoading(false);
      dispatch(setStudentLoading(false));
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Student Details</h1>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading student details...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error}</p>
          </div>
        )}

        {studentData && !loading && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">API Response:</h2>
            <div className="bg-gray-100 p-4 rounded border overflow-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(studentData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!loading && !error && !studentData && (
          <div className="text-center py-8">
            <p className="text-gray-600">No student data found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;