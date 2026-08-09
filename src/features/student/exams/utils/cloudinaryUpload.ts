import { RecordingSignatureData } from "../../../../types/student-exam-types";

// Uploads directly to Cloudinary using a backend-issued signature — bypasses
// our own apiInstance/axios entirely since it must not carry our JWT.
export async function uploadChunkToCloudinary(
    blob: Blob,
    signature: RecordingSignatureData,
): Promise<{ assetId: string; url: string }> {
    const formData = new FormData();
    formData.append('file', blob);
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
