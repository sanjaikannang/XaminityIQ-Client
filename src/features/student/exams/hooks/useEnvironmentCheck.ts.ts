import { useState } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";

export const useEnvironmentCheck = () => {
    const [devices, setDevices] = useState<{
        camera: any | null;
        microphone: any | null;
    }>({
        camera: null,
        microphone: null,
    });

    const testCamera = async (): Promise<boolean> => {
        try {
            const videoTrack = await AgoraRTC.createCameraVideoTrack({
                encoderConfig: "720p_2",
            });
            videoTrack.play("camera-preview-div");
            setDevices((prev) => ({ ...prev, camera: videoTrack }));
            return true;
        } catch (error) {
            console.error("Camera error:", error);
            return false;
        }
    };

    const testMicrophone = async (): Promise<boolean> => {
        try {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
                encoderConfig: "high_quality_stereo",
            });
            setDevices((prev) => ({ ...prev, microphone: audioTrack }));
            return true;
        } catch (error) {
            console.error("Microphone error:", error);
            return false;
        }
    };

    const testScreenShare = async (): Promise<boolean> => {
        try {
            const track = await AgoraRTC.createScreenVideoTrack(
                {
                    encoderConfig: "1080p_1",
                },
                "auto" // important for system audio handling
            );

            // Normalize return type
            const screenVideoTrack = Array.isArray(track) ? track[0] : track;
            const screenAudioTrack = Array.isArray(track) ? track[1] : null;

            screenVideoTrack.play("screen-preview-div");

            setTimeout(() => {
                screenVideoTrack.close();
                screenAudioTrack?.close();
            }, 3000);

            return true;
        } catch (error) {
            console.error("Screen share error:", error);
            return false;
        }
    };


    const checkFullscreen = (): boolean => {
        return !!(
            document.fullscreenEnabled ||
            (document as any).webkitFullscreenEnabled
        );
    };

    const enableFullscreen = async (): Promise<void> => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
            await (elem as any).webkitRequestFullscreen();
        }
    };

    const cleanup = (): void => {
        devices.camera?.close();
        devices.microphone?.close();
        setDevices({ camera: null, microphone: null });
    };

    return {
        testCamera,
        testMicrophone,
        testScreenShare,
        checkFullscreen,
        enableFullscreen,
        cleanup,
        devices,
    };
};