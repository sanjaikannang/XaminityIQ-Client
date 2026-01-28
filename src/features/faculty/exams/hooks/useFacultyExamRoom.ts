import { useEffect, useRef, useState } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { ENV } from '../../../../config/env';

const AGORA_APP_ID = ENV.AGORA_APP_ID;

interface UseFacultyExamRoomProps {
    tokens: any;
    examId: string;
}

export const useFacultyExamRoom = ({ tokens }: UseFacultyExamRoomProps) => {
    const rtcClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })).current;
    const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
    const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);

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

                rtcClient.on("user-published", async (user, mediaType) => {
                    await rtcClient.subscribe(user, mediaType);
                    if (mediaType === "video") {
                        user.videoTrack?.play(`student-video-${user.uid}`);
                    }
                    setRemoteUsers(rtcClient.remoteUsers);
                });

                rtcClient.on("user-left", () => {
                    setRemoteUsers(rtcClient.remoteUsers);
                });
            } catch (error) {
                console.error("Failed to join:", error);
            }
        };

        joinRoom();
    }, [tokens]);

    const talkToAll = async () => {
        if (!localAudioTrack) {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await rtcClient.publish([audioTrack]);
            setLocalAudioTrack(audioTrack);
        }
    };

    const stopTalking = async () => {
        if (localAudioTrack) {
            await rtcClient.unpublish([localAudioTrack]);
            localAudioTrack.close();
            setLocalAudioTrack(null);
        }
    };

    const listenToStudent = (studentUid: any) => {
        const user = rtcClient.remoteUsers.find(u => u.uid === studentUid);
        if (user?.audioTrack) {
            user.audioTrack.play();
        }
    };

    return {
        remoteUsers,
        talkToAll,
        stopTalking,
        listenToStudent,
    };
}