import { useEffect, useState } from 'react';
import ExamSection from './ExamSection';
import { Form, Formik } from 'formik';
import { examStructureSchema } from '../../../../FormikSchema/create-exam.schema';

interface Section {
    id: string;
    name: string;
    order: string;
    marks: string;
    questionType: string;
    totalQuestions: string;
    timeLimit: string;
    isOptional: boolean;
    instructions: string[];
    isExpanded: boolean;
}

interface ExamStructureProps {
    onSectionsUpdate?: (sections: Section[]) => void;
    onFormDataChange?: (values: FormData, isValid: boolean) => void;
}

interface FormData {
    sections: Section[];
}

const ExamStructure: React.FC<ExamStructureProps> = ({ onSectionsUpdate, onFormDataChange }) => {
    const [sections, setSections] = useState<Section[]>([]);

    const initialValues: FormData = {
        sections: sections
    };

    // Update parent component whenever sections change
    useEffect(() => {
        if (onSectionsUpdate) {
            onSectionsUpdate(sections);
        }
    }, [sections, onSectionsUpdate]);

    const handleFormChange = (values: FormData, isValid: boolean) => {
        // Send form data to parent component
        if (onFormDataChange) {
            onFormDataChange(values, isValid);
        }
    };

    const createNewSection = (): Section => ({
        id: Date.now().toString(),
        name: '',
        order: '',
        marks: '',
        questionType: 'MCQ',
        totalQuestions: '',
        timeLimit: '',
        isOptional: false,
        instructions: [],
        isExpanded: true
    });

    const handleAddSection = () => {
        if (sections.length < 5) {
            setSections([...sections, createNewSection()]);
        }
    };

    const handleDeleteSection = (sectionId: string) => {
        setSections(sections.filter(section => section.id !== sectionId));
    };

    const toggleSection = (sectionId: string) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, isExpanded: !section.isExpanded }
                : section
        ));
    };

    const updateSection = (sectionId: string, field: keyof Section, value: any) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, [field]: value }
                : section
        ));
    };

    const handleAddInstruction = (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (section && section.instructions.length < 10) {
            updateSection(sectionId, 'instructions', [...section.instructions, '']);
        }
    };

    const handleInstructionChange = (sectionId: string, index: number, value: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (section) {
            const updated = [...section.instructions];
            updated[index] = value;
            updateSection(sectionId, 'instructions', updated);
        }
    };

    const handleDeleteInstruction = (sectionId: string, index: number) => {
        const section = sections.find(s => s.id === sectionId);
        if (section) {
            const updated = section.instructions.filter((_, i) => i !== index);
            updateSection(sectionId, 'instructions', updated);
        }
    };

    const handleSubmit = (values: FormData) => {
        console.log('ExamStructure form values:', values);
    };

    return (
        <>
            <div className='p-4 space-y-4'>

                <Formik
                    initialValues={initialValues}
                    validationSchema={examStructureSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    values={{ sections }}
                >
                    {({ isValid, errors, touched }) => {
                        // Send form data to parent whenever values change
                        useEffect(() => {
                            handleFormChange({ sections }, isValid);
                        }, [sections, isValid]);

                        return (
                            <Form>

                                {/* Add Section Button */}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleAddSection}
                                        disabled={sections.length >= 5}
                                        className={`px-6 py-1.5 rounded-md flex items-center space-x-2 font-medium ${sections.length >= 5
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-primary text-white cursor-pointer'
                                            }`}
                                    >
                                        <span>Add Section ({sections.length}/5)</span>
                                    </button>
                                </div>

                                {/* Global validation errors */}
                                {errors.sections && typeof errors.sections === 'string' && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                                        {errors.sections}
                                    </div>
                                )}

                                {/* Render Sections using SectionComponent */}
                                {sections.map((section, sectionIndex) => (
                                    <ExamSection
                                        key={section.id}
                                        section={section}
                                        sectionIndex={sectionIndex}
                                        onDeleteSection={handleDeleteSection}
                                        onToggleSection={toggleSection}
                                        onUpdateSection={updateSection}
                                        onAddInstruction={handleAddInstruction}
                                        onInstructionChange={handleInstructionChange}
                                        onDeleteInstruction={handleDeleteInstruction}
                                        errors={errors}
                                        touched={touched}
                                    />
                                ))}

                                {sections.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-lg">No sections created yet.</p>
                                        <p className="text-sm mt-2">Click "Add Section" to create your first exam section.</p>
                                    </div>
                                )}
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </>
    );
};

export default ExamStructure;