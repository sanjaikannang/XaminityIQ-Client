export interface GenerateWrittenQrData {
    token: string;
    expiresAt: string;
}

export interface GenerateWrittenQrResponse {
    success: boolean;
    message: string;
    data?: GenerateWrittenQrData;
}

export interface WrittenAnswerPageData {
    pageNumber: number;
    cloudinaryUrl: string;
    uploadedAt: string;
}

export interface WrittenQrStatusData {
    pageCount: number;
    pages: WrittenAnswerPageData[];
    qrScannedAt?: string;
    isFinalized: boolean;
    qrTokenExpiresAt?: string;
}

export interface GetWrittenQrStatusResponse {
    success: boolean;
    message: string;
    data?: WrittenQrStatusData;
}

export interface FinalizeWrittenAnswerResponse {
    success: boolean;
    message: string;
    pageCount?: number;
}

export interface DeleteWrittenAnswerPageResponse {
    success: boolean;
    message: string;
    pageCount?: number;
}

// ---- Public (mobile, unauthenticated) ----

export interface VerifyQrTokenData {
    questionText: string;
    marks: number;
    existingPageCount: number;
}

export interface VerifyQrTokenResponse {
    success: boolean;
    message: string;
    data?: VerifyQrTokenData;
}

export interface UploadSignatureData {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    publicId: string;
    folder: string;
}

export interface GetUploadSignatureResponse {
    success: boolean;
    message: string;
    data?: UploadSignatureData;
}

export interface RecordPageResponse {
    success: boolean;
    message: string;
    pageCount?: number;
}
