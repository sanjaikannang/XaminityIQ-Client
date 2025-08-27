import { useState, useEffect } from 'react';
import CommonSelect from '../../../../../Common/UI/CustomSelect';
import { createSection, getSectionsByBranch } from '../../../../../Services/Admin/adminAPI';
import { CreateSectionRequest } from '../../../../../Types/admin.types';

interface SectionFormProps {
    onSuccess: () => void;
}

interface SectionFormData {
    name: string;
    branchId: string;
    capacity: string;
}

interface Errors {
    [key: string]: string;
}

interface Touched {
    [key: string]: boolean;
}

const SectionForm = ({ onSuccess }: SectionFormProps) => {
    const [formData, setFormData] = useState<SectionFormData>({
        name: '',
        branchId: '',
        capacity: ''
    });

    const [loading, setLoading] = useState(false);
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});
    const [branches] = useState<Array<{ value: string; label: string }>>([]);

    // Load sections when branch is selected
    useEffect(() => {
        if (formData.branchId) {
            loadSectionsByBranch(formData.branchId);
        }
    }, [formData.branchId]);

    const loadSectionsByBranch = async (branchId: string) => {
        setSectionsLoading(true);
        try {
            const response = await getSectionsByBranch(branchId);
            // Handle the response if needed
        } catch (error) {
            console.error('Error loading sections:', error);
        } finally {
            setSectionsLoading(false);
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
            const sectionData: CreateSectionRequest = {
                name: formData.name,
                branchId: formData.branchId,
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined
            };
            const response = await createSection(sectionData);

            if (response.success) {
                alert('section created successfully!');
                setFormData({
                    name: '',
                    branchId: '',
                    capacity: ''
                });
                setErrors({});
                setTouched({});
                onSuccess();
            } else {
                setErrors({ general: response.message });
            }
        } catch (error: any) {
            console.error('Error creating section:', error);
            setErrors({ general: error.response?.data?.message || 'Error creating section' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
                <div>
                    <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch
                    </label>
                    <CommonSelect
                        id="branchId"
                        label=""
                        options={branches}
                        value={formData.branchId}
                        onChange={handleSelectChange('branchId')}
                        required
                        loading={sectionsLoading}
                        error={touched['branchId'] && errors['branchId'] ? errors['branchId'] : undefined}
                    />
                </div>
                <div>
                    <label htmlFor="sectionName" className="block text-sm font-medium text-gray-700 mb-1">
                        Section Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="sectionName"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="A"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange('capacity')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="60"
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

export default SectionForm;