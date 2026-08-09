import { ENV } from "../../../../config/env";
import { createAxiosInstance } from "../../../../state/services/axios-instance";
import { api } from "../../../../api";

export interface NetworkProbeResult {
    downloadMbps: number;
    uploadMbps: number;
}

const PROBE_SIZE_BYTES = 1024 * 1024; // 1MB, matches the backend's fixed payload

export async function runNetworkProbe(): Promise<NetworkProbeResult> {
    const axiosInstance = createAxiosInstance(ENV.BASE_URL);

    const downloadStart = performance.now();
    await axiosInstance.get(api.studentExams.networkProbeDownload(), { responseType: 'arraybuffer' });
    const downloadSeconds = (performance.now() - downloadStart) / 1000;
    const downloadMbps = (PROBE_SIZE_BYTES * 8) / 1_000_000 / downloadSeconds;

    const uploadPayload = new Blob([new Uint8Array(PROBE_SIZE_BYTES)]);
    const uploadStart = performance.now();
    await axiosInstance.post(api.studentExams.networkProbeUpload(), uploadPayload, {
        headers: { 'Content-Type': 'application/octet-stream' },
    });
    const uploadSeconds = (performance.now() - uploadStart) / 1000;
    const uploadMbps = (PROBE_SIZE_BYTES * 8) / 1_000_000 / uploadSeconds;

    return { downloadMbps, uploadMbps };
}

export const MIN_REQUIRED_MBPS = 1;
