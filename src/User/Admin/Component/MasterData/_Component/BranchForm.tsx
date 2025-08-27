import { useState, useEffect } from 'react';
import CommonSelect from '../../../../../Common/UI/CustomSelect';
import { createBranch, getBranchesByCourse } from '../../../../../Services/Admin/adminAPI';
import { CreateBranchRequest } from '../../../../../Types/admin.types';
import Spinner from '../../../../../Common/UI/Spinner';

interface BranchFormProps {
    onSuccess: () => void;
}

interface BranchFormData {
    name: string;
    code: string;
    courseId: string;
}

interface Errors {
    [key: string]: string;
}

interface Touched {
    [key: string]: boolean;
}

const BranchForm = ({ onSuccess }: BranchFormProps) => {
    const [formData, setFormData] = useState<BranchFormData>({
        name: '',
        code: '',
        courseId: ''
    });

    const [loading, setLoading] = useState(false);
    const [branchesLoading, setBranchesLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});
    const [courses] = useState<Array<{ value: string; label: string }>>([]);

    // Load branches when course is selected
    useEffect(() => {
        if (formData.courseId) {
            loadBranchesByCourse(formData.courseId);
        }
    }, [formData.courseId]);

    const loadBranchesByCourse = async (courseId: string) => {
        setBranchesLoading(true);
        try {
            const response = await getBranchesByCourse(courseId);
            // Handle the response if needed
        } catch (error) {
            console.error('Error loading branches:', error);
        } finally {
            setBranchesLoading(false);
        }
    };

    const handleInputChange = (field: string) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSelectChange = (field: string) => (
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const branchData: CreateBranchRequest = {
                name: formData.name,
                code: formData.code,
                courseId: formData.courseId
            };
            const response = await createBranch(branchData);

            if (response.success) {
                alert('branch created successfully!');
                setFormData({
                    name: '',
                    code: '',
                    courseId: ''
                });
                setErrors({});
                setTouched({});
                onSuccess();
            } else {
                setErrors({ general: response.message });
            }
        } catch (error: any) {
            console.error('Error creating branch:', error);
            setErrors({ general: error.response?.data?.message || 'Error creating branch' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
                <div>
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                        Course<span className="text-red-500">*</span>
                    </label>
                    <CommonSelect
                        id="courseId"
                        label=""
                        options={courses}
                        value={formData.courseId}
                        onChange={handleSelectChange('courseId')}
                        required
                        loading={branchesLoading}
                        error={touched['courseId'] && errors['courseId'] ? errors['courseId'] : undefined}
                    />
                </div>
                <div>
                    <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="branchName"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="Computer Science"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Code<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="branchCode"
                        value={formData.code}
                        onChange={handleInputChange('code')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="CS"
                        required
                    />
                </div>
                {errors.general && (
                    <div className="text-red-600 text-sm">{errors.general}</div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-1 bg-primary text-white rounded-md cursor-pointer"
                    >
                        {loading ? <Spinner /> : 'Create'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default BranchForm;