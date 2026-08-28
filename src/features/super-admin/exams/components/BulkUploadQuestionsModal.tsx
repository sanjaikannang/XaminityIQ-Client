import Papa from "papaparse";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Download, Upload, CheckCircle2, XCircle, FileText } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { QuestionType } from "../../../../utils/enum";
import { ExamSectionData, AddQuestionRequest } from "../../../../types/exams-types";
import { useBulkUploadQuestionsMutation } from "../../../../state/services/endpoints/exams";

interface BulkUploadQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    examId: string;
    examSections: ExamSectionData[];
}

interface ParsedRow {
    rowNumber: number;
    question?: AddQuestionRequest;
    error?: string;
}

const CSV_HEADERS = ['type', 'text', 'marks', 'section', 'option1', 'option2', 'option3', 'option4', 'correctOptions'];

const SAMPLE_CSV = [
    CSV_HEADERS.join(','),
    'MCQ,"What is 2 + 2?",5,Section A,2,3,4,5,3',
    'MSQ,"Which are prime numbers?",5,Section A,2,4,5,9,"1;3"',
    'WRITTEN,"Explain the water cycle in your own words.",10,Section B,,,,,',
    'TYPING,"Write a short paragraph about your favorite subject.",10,Section B,,,,,',
].join('\n');

const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'question-upload-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const parseRow = (row: Record<string, string>, rowNumber: number, sections: ExamSectionData[]): ParsedRow => {
    const type = (row.type || '').trim().toUpperCase();
    if (!Object.values(QuestionType).includes(type as QuestionType)) {
        return { rowNumber, error: `Unknown type "${row.type}" — must be one of ${Object.values(QuestionType).join(', ')}` };
    }

    const text = (row.text || '').trim();
    if (!text) {
        return { rowNumber, error: 'Question text is required' };
    }

    const marks = Number(row.marks);
    if (!marks || marks < 1) {
        return { rowNumber, error: 'Marks must be a positive number' };
    }

    let examSectionId: string | undefined;
    const sectionLabel = (row.section || '').trim();
    if (sectionLabel) {
        const match = sections.find((s) => s.label.toLowerCase() === sectionLabel.toLowerCase());
        if (!match) {
            return { rowNumber, error: `Section "${sectionLabel}" does not exist on this exam — add it first or leave blank` };
        }
        examSectionId = match._id;
    }

    const isSubjective = type === QuestionType.WRITTEN || type === QuestionType.TYPING;
    if (isSubjective) {
        return { rowNumber, question: { type: type as QuestionType, text, marks, examSectionId } };
    }

    const optionTexts = [row.option1, row.option2, row.option3, row.option4].map((o) => (o || '').trim());
    if (optionTexts.some((o) => !o)) {
        return { rowNumber, error: 'MCQ/MSQ questions need all 4 options filled in' };
    }

    const correctIndexes = (row.correctOptions || '').split(';').map((s) => parseInt(s.trim(), 10)).filter((n) => n >= 1 && n <= 4);
    if (correctIndexes.length < 1) {
        return { rowNumber, error: 'correctOptions must list at least one option number (1-4)' };
    }
    if (type === QuestionType.MCQ && correctIndexes.length !== 1) {
        return { rowNumber, error: 'MCQ must have exactly 1 correct option' };
    }

    const options = optionTexts.map((optText, i) => ({ text: optText, isCorrect: correctIndexes.includes(i + 1) }));

    return { rowNumber, question: { type: type as QuestionType, text, marks, examSectionId, options } };
};

const BulkUploadQuestionsModal = ({ isOpen, onClose, examId, examSections }: BulkUploadQuestionsModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
    const [fileName, setFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [resultSummary, setResultSummary] = useState<{ successCount: number; failedCount: number; errors: { rowNumber: number; error?: string }[] } | null>(null);
    const [bulkUploadQuestions, { isLoading }] = useBulkUploadQuestionsMutation();

    const processFile = (file: File) => {
        if (!file.name.toLowerCase().endsWith('.csv')) {
            toast.error('Please select a .csv file');
            return;
        }
        setFileName(file.name);
        setResultSummary(null);

        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data.map((row, i) => parseRow(row, i + 1, examSections));
                setParsedRows(rows);
            },
            error: () => toast.error('Failed to parse CSV file'),
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validRows = parsedRows.filter((r) => r.question);
    const invalidRows = parsedRows.filter((r) => r.error);

    const handleUpload = async () => {
        if (validRows.length === 0) return;
        try {
            const response = await bulkUploadQuestions({
                examId,
                data: { questions: validRows.map((r) => r.question as AddQuestionRequest) },
            }).unwrap();
            const { successCount, failedCount, failedUploads } = response.summary;
            setResultSummary({
                successCount,
                failedCount,
                errors: failedUploads.map((f) => ({ rowNumber: f.rowNumber, error: f.error })),
            });
            if (failedCount === 0) {
                toast.success(`${successCount} question(s) uploaded successfully`);
            }
        } catch (error: any) {
            toast.error(error.data?.message || 'Bulk upload failed');
        }
    };

    const handleClose = () => {
        setParsedRows([]);
        setFileName('');
        setResultSummary(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Questions (CSV)" size="lg">
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border border-borderLight bg-bgSecondary p-3">
                    <p className="text-sm text-textSecondary">
                        Download the template, fill in your questions, then upload it back here.
                        {examSections.length === 0 && ' (Add exam sections first if you want to assign questions to one.)'}
                    </p>
                    <Button variant="outline" size="sm" icon={Download} onClick={downloadSampleCsv}>
                        Sample CSV
                    </Button>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                        isDragging ? 'border-primary bg-primary/5' : 'border-borderLight bg-bgSecondary hover:border-primary/50'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {fileName ? (
                        <>
                            <FileText className="w-8 h-8 text-primary" />
                            <p className="text-sm font-medium text-textPrimary">{fileName}</p>
                            <p className="text-xs text-textTertiary">Click or drop another file to replace</p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-textTertiary" />
                            <p className="text-sm text-textSecondary">
                                <span className="font-medium text-primary">Click to upload</span> or drag and drop a CSV file
                            </p>
                            <p className="text-xs text-textTertiary">.csv files only</p>
                        </>
                    )}
                </div>

                {parsedRows.length > 0 && !resultSummary && (
                    <div className="max-h-64 overflow-y-auto rounded-md border border-borderLight">
                        <table className="w-full text-xs">
                            <thead className="bg-bgSecondary sticky top-0">
                                <tr>
                                    <th className="px-2 py-1.5 text-left">Row</th>
                                    <th className="px-2 py-1.5 text-left">Status</th>
                                    <th className="px-2 py-1.5 text-left">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-borderLight">
                                {parsedRows.map((row) => (
                                    <tr key={row.rowNumber}>
                                        <td className="px-2 py-1.5">{row.rowNumber}</td>
                                        <td className="px-2 py-1.5">
                                            {row.question ? (
                                                <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 size={12} /> Valid</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-600"><XCircle size={12} /> Invalid</span>
                                            )}
                                        </td>
                                        <td className="px-2 py-1.5 text-textSecondary">
                                            {row.question ? `${row.question.type} — ${row.question.text.slice(0, 50)}` : row.error}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {resultSummary && (
                    <div className="rounded-md border border-borderLight p-3 space-y-2">
                        <p className="text-sm font-medium text-textPrimary">
                            {resultSummary.successCount} uploaded, {resultSummary.failedCount} failed
                        </p>
                        {resultSummary.errors.map((e) => (
                            <p key={e.rowNumber} className="text-xs text-red-600">Row {e.rowNumber}: {e.error}</p>
                        ))}
                    </div>
                )}

                {!resultSummary && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-textTertiary">
                            {parsedRows.length > 0 && `${validRows.length} valid, ${invalidRows.length} invalid`}
                        </p>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={Upload}
                            onClick={handleUpload}
                            loading={isLoading}
                            disabled={isLoading || validRows.length === 0}
                        >
                            {isLoading ? '' : `Upload ${validRows.length} Question(s)`}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default BulkUploadQuestionsModal;
