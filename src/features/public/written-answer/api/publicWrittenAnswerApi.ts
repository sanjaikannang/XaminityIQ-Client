import axios from "axios";
import { ENV } from "../../../../config/env";
import {
    VerifyQrTokenResponse,
    GetUploadSignatureResponse,
    RecordPageResponse,
} from "../../../../types/written-answer-types";

// A bare axios instance with none of apiInstance's interceptors — this page runs
// on a phone that was never logged in, so there is no stored access token to
// attach, and apiInstance's interceptor would redirect to /login if we tried.
const publicClient = axios.create({ baseURL: ENV.BASE_URL });

export async function verifyQrToken(token: string): Promise<VerifyQrTokenResponse> {
    const response = await publicClient.post("/public/written-answer/verify", { token });
    return response.data;
}

export async function getUploadSignature(token: string, pageNumber: number): Promise<GetUploadSignatureResponse> {
    const response = await publicClient.post("/public/written-answer/signature", { token, pageNumber });
    return response.data;
}

export async function recordPage(
    token: string,
    pageNumber: number,
    cloudinaryUrl: string,
    cloudinaryAssetId: string,
): Promise<RecordPageResponse> {
    const response = await publicClient.post("/public/written-answer/page", {
        token,
        pageNumber,
        cloudinaryUrl,
        cloudinaryAssetId,
    });
    return response.data;
}
