import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { GetFacultyResponse } from "../../../Types/admin.types";
import { setFacultyError, setFacultyLoading, setSelectedFaculty } from "../../../State/Slices/adminSlice";
import { getFaculty } from "../../../Services/Admin/adminAPI";

const FacultyDetail = () => {

    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [facultyData, setFacultyData] = useState<GetFacultyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Faculty details
    const fetchFacultyDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            dispatch(setFacultyLoading(true));

            const response = await getFaculty(id);
            setFacultyData(response);

            // Update Redux state if needed
            if (response.success && response.data.faculty.length > 0) {
                dispatch(setSelectedFaculty(response.data.faculty[0]));
            }

        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch student details';
            setError(errorMessage);
            dispatch(setFacultyError(errorMessage));
        } finally {
            setLoading(false);
            dispatch(setFacultyLoading(false));
        }
    };

    useEffect(() => {
        fetchFacultyDetails();
    }, [id]);

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold mb-6">Faculty Details</h1>

                    {loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Loading faculty details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p>Error: {error}</p>
                        </div>
                    )}

                    {facultyData && !loading && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">API Response:</h2>
                            <div className="bg-gray-100 p-4 rounded border overflow-auto">
                                <pre className="whitespace-pre-wrap text-sm">
                                    {JSON.stringify(facultyData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {!loading && !error && !facultyData && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No faculty data found</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FacultyDetail