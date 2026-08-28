import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Camera, CheckCircle2, AlertCircle, FileText, Loader2 } from "lucide-react";
import { verifyQrToken, getUploadSignature, recordPage } from "../api/publicWrittenAnswerApi";
import { uploadPageToCloudinary } from "../utils/cloudinaryPageUpload";

type PageState = 'LOADING' | 'READY' | 'INVALID' | 'UPLOADING';

const MobileWrittenAnswerPage = () => {
    const { token } = useParams<{ token: string }>();
    // Display-only context carried from the exam screen — not part of the
    // signed QR token, just so the student can confirm which question this is.
    const [searchParams] = useSearchParams();
    const questionNumber = searchParams.get('qNo');
    const sectionLabel = searchParams.get('section');
    const [state, setState] = useState<PageState>('LOADING');
    const [errorMessage, setErrorMessage] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [marks, setMarks] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!token) return;
        verifyQrToken(token)
            .then((response) => {
                if (!response.data) throw new Error(response.message);
                setQuestionText(response.data.questionText);
                setMarks(response.data.marks);
                setPageCount(response.data.existingPageCount);
                setState('READY');
            })
            .catch((error: any) => {
                setErrorMessage(error.response?.data?.message || 'This QR code has expired or is invalid — please generate a new one from your exam screen');
                setState('INVALID');
            });
    }, [token]);

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !token) return;

        setState('UPLOADING');
        setErrorMessage('');
        try {
            const nextPageNumber = pageCount + 1;
            const signatureResponse = await getUploadSignature(token, nextPageNumber);
            if (!signatureResponse.data) throw new Error(signatureResponse.message);

            const { assetId, url } = await uploadPageToCloudinary(file, signatureResponse.data);
            const recordResponse = await recordPage(token, nextPageNumber, url, assetId);

            setPageCount(recordResponse.pageCount ?? nextPageNumber);
            setState('READY');
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || error.message || 'Upload failed — please try again');
            setState('READY');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (state === 'LOADING') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bgSecondary p-6">
                <div className="flex flex-col items-center gap-3 text-textSecondary">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (state === 'INVALID') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bgSecondary p-6">
                <div className="max-w-sm w-full bg-whiteColor rounded-xl border border-red-200 p-6 text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                    <p className="text-textPrimary font-semibold">QR Code Invalid</p>
                    <p className="text-sm text-textSecondary">{errorMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgSecondary px-4 py-6 flex flex-col items-center gap-4">
            <div className="w-full max-w-sm text-center">
                <p className="text-base font-bold text-primary tracking-tight">XaminityIQ</p>
                <h1 className="text-lg font-bold text-textPrimary mt-0.5">Written Answer Capture</h1>
            </div>

            <div className="w-full max-w-sm bg-whiteColor rounded-xl border border-borderLight p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <FileText className="w-3.5 h-3.5 text-textSecondary" />
                    <p className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                        {questionNumber ? `Question ${questionNumber}` : 'Question'}
                        {sectionLabel && ` · ${sectionLabel}`}
                        {' · '}{marks} marks
                    </p>
                </div>
                <p className="text-textPrimary text-sm leading-relaxed">{questionText}</p>
            </div>

            <div className="w-full max-w-sm bg-whiteColor rounded-xl border border-borderLight p-5 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                    {pageCount > 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                        <Camera className="w-5 h-5 text-textTertiary" />
                    )}
                    <p className="text-lg font-semibold text-textPrimary">
                        {pageCount} page{pageCount === 1 ? '' : 's'} uploaded
                    </p>
                </div>

                {pageCount > 0 && (
                    <div className="flex justify-center gap-1.5">
                        {Array.from({ length: pageCount }).map((_, i) => (
                            <span key={i} className="w-6 h-6 rounded-md bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center">
                                {i + 1}
                            </span>
                        ))}
                    </div>
                )}

                {errorMessage && (
                    <p className="text-sm text-red-600 flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
                    </p>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelected}
                    disabled={state === 'UPLOADING'}
                    className="hidden"
                    id="page-capture-input"
                />
                <label
                    htmlFor="page-capture-input"
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-lg text-sm font-semibold text-whiteColor transition-colors ${state === 'UPLOADING' ? 'bg-borderDark cursor-not-allowed' : 'bg-primary hover:bg-primary/90 cursor-pointer'}`}
                >
                    {state === 'UPLOADING' ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                        </>
                    ) : (
                        <>
                            <Camera className="w-4 h-4" /> Photograph Page {pageCount + 1}
                        </>
                    )}
                </label>

                <p className="text-xs text-textSecondary leading-relaxed">
                    Once you've photographed every page, go back to your exam screen and tap <strong className="text-textPrimary">"Finish &amp; Save Answer"</strong>.
                </p>
            </div>
        </div>
    );
};

export default MobileWrittenAnswerPage;
