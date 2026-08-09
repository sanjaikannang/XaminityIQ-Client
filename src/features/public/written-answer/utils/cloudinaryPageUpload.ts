import { UploadSignatureData } from "../../../../types/written-answer-types";

// Uploads a page photo directly to Cloudinary using a backend-issued signature —
// mirrors features/student/exams/utils/cloudinaryUpload.ts's uploadChunkToCloudinary,
// duplicated here rather than shared since this page lives in an entirely separate,
// unauthenticated feature area.
export async function uploadPageToCloudinary(
    file: File,
    signature: UploadSignatureData,
): Promise<{ assetId: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    formData.append('public_id', signature.publicId);
    formData.append('folder', signature.folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Cloudinary upload failed with status ${response.status}`);
    }

    const result = await response.json();
    return { assetId: result.asset_id, url: result.secure_url };
}
