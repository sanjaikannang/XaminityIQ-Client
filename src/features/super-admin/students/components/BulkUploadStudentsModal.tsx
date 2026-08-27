import Papa from "papaparse";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Download, Upload, CheckCircle2, XCircle } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { Gender, AdmissionType } from "../../../../utils/enum";
import { CreateStudentRequest } from "../../../../types/students-types";
import { useBulkUploadStudentsMutation } from "../../../../state/services/endpoints/students";

interface BulkUploadStudentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ParsedRow {
    rowNumber: number;
    student?: CreateStudentRequest;
    error?: string;
}

// Only the fields that stay mandatory at admin-creation time (see
// create-student.request.ts) — everything else (address, emergency contact,
// education history, parent/guardian, profile photo) is self-serve, so the
// bulk template stays minimal and doesn't need to change every time a
// self-serve field is added.
const CSV_HEADERS = [
    'firstName', 'lastName', 'gender', 'dateOfBirth', 'personalEmail', 'phoneNumber',
    'batchId', 'courseId', 'departmentId', 'currentSemester', 'admissionType',
];

const SAMPLE_CSV = [
    CSV_HEADERS.join(','),
    'Ravi,Kumar,MALE,2005-06-15,ravi.kumar@example.com,+919876543210,<batchId>,<courseId>,<departmentId>,1,REGULAR',
    'Divya,Sharma,FEMALE,2005-09-02,divya.sharma@example.com,+919876543211,<batchId>,<courseId>,<departmentId>,1,REGULAR',
].join('\n');

const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-upload-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const parseRow = (row: Record<string, string>, rowNumber: number): ParsedRow => {
    const firstName = (row.firstName || '').trim();
    const lastName = (row.lastName || '').trim();
    if (!firstName || !lastName) return { rowNumber, error: 'firstName and lastName are required' };

    const gender = (row.gender || '').trim().toUpperCase();
    if (!Object.values(Gender).includes(gender as Gender)) {
        return { rowNumber, error: `Invalid gender "${row.gender}" — must be one of ${Object.values(Gender).join(', ')}` };
    }

    const dateOfBirth = (row.dateOfBirth || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        return { rowNumber, error: 'dateOfBirth must be in YYYY-MM-DD format' };
    }

    const personalEmail = (row.personalEmail || '').trim();
    if (!personalEmail.includes('@')) return { rowNumber, error: 'personalEmail is invalid' };

    const phoneNumber = (row.phoneNumber || '').trim();
    if (!/^\+91\d{10}$/.test(phoneNumber)) return { rowNumber, error: 'phoneNumber must be +91 followed by 10 digits' };

    const batchId = (row.batchId || '').trim();
    const courseId = (row.courseId || '').trim();
    const departmentId = (row.departmentId || '').trim();
    if (!batchId || !courseId || !departmentId) return { rowNumber, error: 'batchId, courseId, and departmentId are required' };

    const currentSemester = Number(row.currentSemester);
    if (!currentSemester || currentSemester < 1) return { rowNumber, error: 'currentSemester must be a positive number' };

    const admissionType = (row.admissionType || '').trim().toUpperCase();
    if (!Object.values(AdmissionType).includes(admissionType as AdmissionType)) {
        return { rowNumber, error: `Invalid admissionType "${row.admissionType}" — must be one of ${Object.values(AdmissionType).join(', ')}` };
    }

    return {
        rowNumber,
        student: {
            firstName, lastName, gender, dateOfBirth, personalEmail, phoneNumber,
            batchId, courseId, departmentId, currentSemester, admissionType,
        } as CreateStudentRequest,
    };
};

const BulkUploadStudentsModal = ({ isOpen, onClose }: BulkUploadStudentsModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
    const [fileName, setFileName] = useState('');
    const [resultSummary, setResultSummary] = useState<{ successCount: number; failedCount: number; errors: { rowNumber: number; error?: string }[] } | null>(null);
    const [bulkUploadStudents, { isLoading }] = useBulkUploadStudentsMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setResultSummary(null);

        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data.map((row, i) => parseRow(row, i + 1));
                setParsedRows(rows);
            },
            error: () => toast.error('Failed to parse CSV file'),
        });
    };

    const validRows = parsedRows.filter((r) => r.student);
    const invalidRows = parsedRows.filter((r) => r.error);

    const handleUpload = async () => {
        if (validRows.length === 0) return;
        try {
            const response = await bulkUploadStudents({
                students: validRows.map((r) => r.student as CreateStudentRequest),
            }).unwrap();
            const { successCount, failedCount, failedUploads } = response.summary;
            setResultSummary({
                successCount,
                failedCount,
                errors: failedUploads.map((f) => ({ rowNumber: f.rowNumber, error: f.error })),
            });
            if (failedCount === 0) {
                toast.success(`${successCount} student(s) uploaded successfully`);
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
        <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Upload Students (CSV)" size="lg">
            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border border-borderLight bg-bgSecondary p-3">
                    <p className="text-sm text-textSecondary">
                        Only identity + academic placement fields are required here — students complete the rest
                        of their profile (address, emergency contact, education history, etc.) themselves after
                        logging in.
                    </p>
                    <Button variant="outline" size="sm" icon={Download} onClick={downloadSampleCsv}>
                        Sample CSV
                    </Button>
                </div>

                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-textSecondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-whiteColor file:cursor-pointer cursor-pointer"
                    />
                    {fileName && <p className="text-xs text-textTertiary mt-1">Selected: {fileName}</p>}
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
                                            {row.student ? (
                                                <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 size={12} /> Valid</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-600"><XCircle size={12} /> Invalid</span>
                                            )}
                                        </td>
                                        <td className="px-2 py-1.5 text-textSecondary">
                                            {row.student ? `${row.student.firstName} ${row.student.lastName} — ${row.student.personalEmail}` : row.error}
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
                            {isLoading ? '' : `Upload ${validRows.length} Student(s)`}
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default BulkUploadStudentsModal;
