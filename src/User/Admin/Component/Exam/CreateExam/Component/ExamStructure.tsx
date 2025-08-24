import { useEffect, useState } from 'react';
import ExamSection from './ExamSection';

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
}

const ExamStructure: React.FC<ExamStructureProps> = ({ onSectionsUpdate }) => {

    const [sections, setSections] = useState<Section[]>([]);

    // Update parent component whenever sections change
    useEffect(() => {
        if (onSectionsUpdate) {
            onSectionsUpdate(sections);
        }
    }, [sections, onSectionsUpdate]);

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

    return (
        <div className='p-4 space-y-4'>
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
                />
            ))}

            {sections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No sections created yet.</p>
                    <p className="text-sm mt-2">Click "Add Section" to create your first exam section.</p>
                </div>
            )}
        </div>
    );
};

export default ExamStructure;