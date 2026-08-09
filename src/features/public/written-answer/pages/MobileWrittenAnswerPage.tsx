import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyQrToken, getUploadSignature, recordPage } from "../api/publicWrittenAnswerApi";
import { uploadPageToCloudinary } from "../utils/cloudinaryPageUpload";

type PageState = 'LOADING' | 'READY' | 'INVALID' | 'UPLOADING';

const MobileWrittenAnswerPage = () => {
    const { token } = useParams<{ token: string }>();
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
                <p className="text-textSecondary">Loading...</p>
            </div>
        );
    }

    if (state === 'INVALID') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bgSecondary p-6">
                <div className="max-w-sm text-center space-y-2">
                    <p className="text-red-600 font-medium">{errorMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgSecondary p-6 flex flex-col items-center gap-6">
            <div className="w-full max-w-sm bg-whiteColor rounded-lg border border-borderLight p-4 space-y-2">
                <p className="text-xs font-semibold text-textSecondary">Question ({marks} marks)</p>
                <p className="text-textPrimary">{questionText}</p>
            </div>

            <div className="w-full max-w-sm bg-whiteColor rounded-lg border border-borderLight p-4 text-center space-y-4">
                <p className="text-lg font-semibold text-textPrimary">{pageCount} page{pageCount === 1 ? '' : 's'} uploaded</p>

                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

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
                    className={`block w-full px-4 py-3 rounded-md text-sm font-medium text-whiteColor ${state === 'UPLOADING' ? 'bg-borderLight cursor-not-allowed' : 'bg-primary cursor-pointer'}`}
                >
                    {state === 'UPLOADING' ? 'Uploading...' : `Photograph Page ${pageCount + 1}`}
                </label>

                <p className="text-xs text-textSecondary">
                    Once you've photographed every page, go back to your exam screen and tap "Finish &amp; Save Answer".
                </p>
            </div>
        </div>
    );
};

export default MobileWrittenAnswerPage;
