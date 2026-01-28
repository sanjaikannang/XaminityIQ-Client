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
}: UseStudentExamRoomProps) => {
    // ⭐ TWO SEPARATE CLIENTS - One for camera, one for screen
    const cameraClient = useRef<IAgoraRTCClient>(
        AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
    ).current;

    const screenClient = useRef<IAgoraRTCClient>(
        AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
    ).current;

    const rtmClient = useRef<any>(null);

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

    useEffect(() => {
        if (!tokens) return;

        let mounted = true;

        const joinExamRoom = async () => {
            try {
                console.log("🚀 Starting exam room join...");
                console.log("📋 Tokens:", {
                    channelName: tokens.channelName,
                    uid: tokens.uid,
                    hasRtcToken: !!tokens.rtcToken,
                    hasRtmToken: !!tokens.rtmToken
                });

                // ============ CLIENT 1: CAMERA + AUDIO ============
                console.log("🎥 Joining camera client with UID:", tokens.uid);
                
                await cameraClient.join(
                    AGORA_APP_ID,
                    tokens.channelName,
                    tokens.rtcToken,
                    tokens.uid
                );

                console.log("✅ Camera client joined successfully");

                // Create camera and audio tracks
                const [audioTrack, videoTrack] =
                    await AgoraRTC.createMicrophoneAndCameraTracks();

                console.log("✅ Created camera and audio tracks");

                // Publish camera + audio
                await cameraClient.publish([audioTrack, videoTrack]);

                console.log("✅ Published camera and audio to channel");

                // Play video preview locally
                if (mounted) {
                    videoTrack.play("local-video-preview");
                    console.log("✅ Playing local video preview");
                }

                // ============ CLIENT 2: SCREEN SHARE ============
                const screenUid = `${tokens.uid}_screen`;
                console.log("🖥️ Joining screen client with UID:", screenUid);

                await screenClient.join(
                    AGORA_APP_ID,
                    tokens.channelName,
                    tokens.rtcToken, // Same token works because backend uses UID=0
                    screenUid
                );

                console.log("✅ Screen client joined successfully");

                // Create screen share track
                const screenTrack = await AgoraRTC.createScreenVideoTrack(
                    { encoderConfig: "1080p_1" },
                    "disable"
                );

                console.log("✅ Created screen share track");

                const screenVideoTrack = Array.isArray(screenTrack) 
                    ? screenTrack[0] 
                    : screenTrack;

                // Publish screen share
                await screenClient.publish([screenVideoTrack]);

                console.log("✅ Published screen share to channel");

                if (!mounted) return;

                setLocalTracks({
                    audio: audioTrack,
                    video: videoTrack,
                    screen: screenVideoTrack as ILocalVideoTrack,
                });

                // ============ RTM LOGIN ============
                console.log("💬 Logging into RTM...");
                
                rtmClient.current = new AgoraRTM.RTM(
                    AGORA_APP_ID,
                    tokens.uid
                );

                await rtmClient.current.login({
                    token: tokens.rtmToken,
                });

                console.log("✅ RTM logged in successfully");
                console.log("🎉 All systems ready!");

                setIsJoined(true);
            } catch (error) {
                console.error("❌ Failed to join exam room:", error);
                // console.error("Error details:", {
                //     name: error.name,
                //     message: error.message,
                //     code: error.code
                // });
            }
        };

        joinExamRoom();

        return () => {
            mounted = false;
            leaveExamRoom();
        };
    }, [tokens]);

    const sendMessageToFaculty = async (
        message: string,
        facultyUid: string
    ): Promise<void> => {
        try {
            if (!rtmClient.current) {
                console.warn("RTM client not initialized");
                return;
            }

            const peer = rtmClient.current.createPeerMessageChannel(facultyUid);
            await peer.send({ text: message });
            console.log("✅ Message sent to faculty");
        } catch (error) {
            console.error("❌ RTM send failed:", error);
        }
    };

    const toggleAudio = async (enabled: boolean) => {
        try {
            await localTracks.audio?.setEnabled(enabled);
            console.log(`🎤 Audio ${enabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error("❌ Toggle audio failed:", error);
        }
    };

    const toggleVideo = async (enabled: boolean) => {
        try {
            await localTracks.video?.setEnabled(enabled);
            console.log(`📹 Video ${enabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error("❌ Toggle video failed:", error);
        }
    };

    const toggleScreen = async (enabled: boolean) => {
        try {
            await localTracks.screen?.setEnabled(enabled);
            console.log(`🖥️ Screen share ${enabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error("❌ Toggle screen failed:", error);
        }
    };

    const leaveExamRoom = async () => {
        try {
            console.log("👋 Leaving exam room...");

            localTracks.audio?.close();
            localTracks.video?.close();
            localTracks.screen?.close();

            if (cameraClient.connectionState !== "DISCONNECTED") {
                await cameraClient.leave();
                console.log("✅ Camera client left");
            }

            if (screenClient.connectionState !== "DISCONNECTED") {
                await screenClient.leave();
                console.log("✅ Screen client left");
            }

            if (rtmClient.current) {
                await rtmClient.current.logout();
                console.log("✅ RTM logged out");
            }

            setIsJoined(false);
            console.log("👋 Successfully left exam room");
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