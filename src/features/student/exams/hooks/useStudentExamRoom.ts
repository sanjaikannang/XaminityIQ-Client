import { useEffect, useRef, useState } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";

const AGORA_APP_ID = 'your_app_id'; // Move to env

interface UseStudentExamRoomProps {
    tokens: any;
    examId: string;
}

export const useStudentExamRoom = ({ tokens, examId }: UseStudentExamRoomProps) => {
    const rtcClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })).current;
    const rtmClient = useRef<any>(AgoraRTM.createInstance(AGORA_APP_ID)).current;

    const [localTracks, setLocalTracks] = useState<any>({
        video: null,
        audio: null,
        screen: null,
    });
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        if (!tokens) return;

        const joinRoom = async () => {
            try {
                await rtcClient.join(
                    AGORA_APP_ID,
                    tokens.channelName,
                    tokens.rtcToken,
                    tokens.uid
                );

                const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                const screenTrack = await AgoraRTC.createScreenVideoTrack();

                await rtcClient.publish([audioTrack, videoTrack, screenTrack]);
                videoTrack.play("local-video-preview");

                setLocalTracks({ video: videoTrack, audio: audioTrack, screen: screenTrack });
                setIsJoined(true);
            } catch (error) {
                console.error("Failed to join:", error);
            }
        };

        joinRoom();

        return () => {
            leaveExamRoom();
        };
    }, [tokens]);

    const sendMessageToFaculty = async (message: string, facultyUid: string): Promise<void> => {
        try {
            await rtmClient.sendMessageToPeer({ text: message }, facultyUid);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const toggleAudio = async (enabled: boolean): Promise<void> => {
        await localTracks.audio?.setEnabled(enabled);
    };

    const toggleVideo = async (enabled: boolean): Promise<void> => {
        await localTracks.video?.setEnabled(enabled);
    };

    const leaveExamRoom = async (): Promise<void> => {
        localTracks.video?.close();
        localTracks.audio?.close();
        localTracks.screen?.close();
        await rtcClient.leave();
    };

    return {
        isJoined,
        localTracks,
        sendMessageToFaculty,
        toggleAudio,
        toggleVideo,
        leaveExamRoom,
    };
};