import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
    IAgoraRTCClient,
    ILocalAudioTrack,
    ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";

const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID;

interface Tokens {
    rtcToken: string;
    rtmToken: string;
    channelName: string;
    uid: string;
}

interface UseStudentExamRoomProps {
    tokens: Tokens | null;
    examId: string;
}

export const useStudentExamRoom = ({
    tokens,
    examId,
}: UseStudentExamRoomProps) => {
    /* ================= RTC ================= */
    const rtcClient = useRef<IAgoraRTCClient>(
        AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
    ).current;

    /* ================= RTM ================= */
    const rtmClient = useRef<any>(null);

    /* ================= STATE ================= */
    const [isJoined, setIsJoined] = useState(false);

    const [localTracks, setLocalTracks] = useState<{
        audio: ILocalAudioTrack | null;
        video: ILocalVideoTrack | null;
        screen: ILocalVideoTrack | null;
    }>({
        audio: null,
        video: null,
        screen: null,
    });

    /* ================= JOIN ROOM ================= */
    useEffect(() => {
        if (!tokens) return;

        let mounted = true;

        const joinExamRoom = async () => {
            try {
                /* ---------- RTC JOIN ---------- */
                await rtcClient.join(
                    AGORA_APP_ID,
                    tokens.channelName,
                    tokens.rtcToken,
                    tokens.uid
                );

                /* ---------- TRACKS ---------- */
                const [audioTrack, videoTrack] =
                    await AgoraRTC.createMicrophoneAndCameraTracks();

                const screenTrack =
                    await AgoraRTC.createScreenVideoTrack(
                        { encoderConfig: "1080p_1" },
                        "disable"
                    );

                await rtcClient.publish([audioTrack, videoTrack, screenTrack]);

                videoTrack.play("local-video-preview");

                if (!mounted) return;

                setLocalTracks({
                    audio: audioTrack,
                    video: videoTrack,
                    screen: screenTrack as ILocalVideoTrack,
                });

                /* ---------- RTM LOGIN ---------- */
                rtmClient.current = new AgoraRTM.RTM(
                    AGORA_APP_ID,
                    tokens.uid
                );

                await rtmClient.current.login({
                    token: tokens.rtmToken,
                });

                setIsJoined(true);
            } catch (error) {
                console.error("❌ Failed to join exam room:", error);
            }
        };

        joinExamRoom();

        return () => {
            mounted = false;
            leaveExamRoom();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokens]);

    /* ================= RTM MESSAGE ================= */
    const sendMessageToFaculty = async (
        message: string,
        facultyUid: string
    ): Promise<void> => {
        try {
            if (!rtmClient.current) return;

            const peer =
                rtmClient.current.createPeerMessageChannel(facultyUid);

            await peer.send({ text: message });
        } catch (error) {
            console.error("❌ RTM send failed:", error);
        }
    };

    /* ================= CONTROLS ================= */
    const toggleAudio = async (enabled: boolean) => {
        await localTracks.audio?.setEnabled(enabled);
    };

    const toggleVideo = async (enabled: boolean) => {
        await localTracks.video?.setEnabled(enabled);
    };

    const toggleScreen = async (enabled: boolean) => {
        await localTracks.screen?.setEnabled(enabled);
    };

    /* ================= LEAVE ================= */
    const leaveExamRoom = async () => {
        try {
            localTracks.audio?.close();
            localTracks.video?.close();
            localTracks.screen?.close();

            if (rtcClient.connectionState !== "DISCONNECTED") {
                await rtcClient.leave();
            }

            if (rtmClient.current) {
                await rtmClient.current.logout();
            }

            setIsJoined(false);
        } catch (error) {
            console.error("❌ Leave exam failed:", error);
        }
    };

    return {
        isJoined,
        localTracks,
        sendMessageToFaculty,
        toggleAudio,
        toggleVideo,
        toggleScreen,
        leaveExamRoom,
    };
};
