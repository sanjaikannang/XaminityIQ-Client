import { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { ENV } from '../../../../config/env';

const AGORA_APP_ID = ENV.AGORA_APP_ID;

interface UseFacultyExamRoomProps {
    tokens: any;
    examId: string;
}

interface StudentStreams {
    uid: string;
    cameraUser?: IAgoraRTCRemoteUser;
    screenUser?: IAgoraRTCRemoteUser;
}

export const useFacultyExamRoom = ({ tokens }: UseFacultyExamRoomProps) => {
    const rtcClient = useRef(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })).current;
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [studentStreams, setStudentStreams] = useState<StudentStreams[]>([]);
    const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);

    useEffect(() => {
        if (!tokens) return;

        const joinRoom = async () => {
            try {
                console.log("🎓 Faculty joining room...");
                console.log("📋 Faculty tokens:", {
                    channelName: tokens.channelName,
                    uid: tokens.uid,
                });

                await rtcClient.join(
                    AGORA_APP_ID,
                    tokens.channelName,
                    tokens.rtcToken,
                    tokens.uid
                );

                console.log("✅ Faculty joined channel successfully");

                // Listen for remote users publishing
                rtcClient.on("user-published", async (user, mediaType) => {
                    console.log(`📡 User published:`, {
                        uid: user.uid,
                        mediaType,
                        isScreenShare: String(user.uid).endsWith('_screen')
                    });

                    try {
                        await rtcClient.subscribe(user, mediaType);
                        console.log(`✅ Subscribed to user ${user.uid} ${mediaType}`);

                        if (mediaType === "video") {
                            setTimeout(() => {
                                if (user.videoTrack) {
                                    // Determine if this is camera or screen share
                                    const uidStr = String(user.uid);
                                    const isScreenShare = uidStr.endsWith('_screen');
                                    const baseUid = isScreenShare
                                        ? uidStr.replace('_screen', '')
                                        : uidStr;

                                    const containerId = isScreenShare
                                        ? `student-screen-${baseUid}`
                                        : `student-camera-${baseUid}`;

                                    console.log(`🎬 Playing ${isScreenShare ? 'screen' : 'camera'} for student ${baseUid} in container: ${containerId}`);

                                    try {
                                        user.videoTrack.play(containerId);
                                        console.log(`✅ Successfully playing video in ${containerId}`);
                                    } catch (playError) {
                                        console.error(`❌ Failed to play video in ${containerId}:`, playError);
                                    }
                                }
                            }, 200); // Increased timeout to ensure DOM is ready
                        }

                        if (mediaType === "audio") {
                            user.audioTrack?.play();
                            console.log(`🔊 Playing audio for ${user.uid}`);
                        }

                        // Update state
                        setRemoteUsers([...rtcClient.remoteUsers]);
                        organizeStudentStreams(rtcClient.remoteUsers);

                    } catch (error) {
                        console.error(`❌ Failed to subscribe to ${user.uid}:`, error);
                    }
                });

                rtcClient.on("user-unpublished", (user, mediaType) => {
                    console.log(`📴 User ${user.uid} unpublished ${mediaType}`);
                    setRemoteUsers([...rtcClient.remoteUsers]);
                    organizeStudentStreams(rtcClient.remoteUsers);
                });

                rtcClient.on("user-left", (user) => {
                    console.log(`👋 User ${user.uid} left the channel`);
                    setRemoteUsers([...rtcClient.remoteUsers]);
                    organizeStudentStreams(rtcClient.remoteUsers);
                });

                // Debug: Log remote users every 5 seconds
                const interval = setInterval(() => {
                    console.log("📊 Current remote users:", rtcClient.remoteUsers.length);
                    rtcClient.remoteUsers.forEach(user => {
                        console.log(`  - UID: ${user.uid}, Video: ${!!user.videoTrack}, Audio: ${!!user.audioTrack}`);
                    });
                }, 5000);

                return () => clearInterval(interval);

            } catch (error) {
                console.error("❌ Faculty failed to join:", error);
            }
        };

        joinRoom();

        return () => {
            rtcClient.leave();
        };
    }, [tokens]);

    // Organize users into camera + screen pairs
    const organizeStudentStreams = (users: IAgoraRTCRemoteUser[]) => {
        const streamsMap = new Map<string, StudentStreams>();

        console.log("🔄 Organizing student streams...");

        users.forEach(user => {
            const uidStr = String(user.uid);
            const isScreenShare = uidStr.endsWith('_screen');
            const baseUid = isScreenShare ? uidStr.replace('_screen', '') : uidStr;

            console.log(`  Processing: ${uidStr} (base: ${baseUid}, isScreen: ${isScreenShare})`);

            if (!streamsMap.has(baseUid)) {
                streamsMap.set(baseUid, { uid: baseUid });
            }

            const stream = streamsMap.get(baseUid)!;
            if (isScreenShare) {
                stream.screenUser = user;
            } else {
                stream.cameraUser = user;
            }
        });

        const streams = Array.from(streamsMap.values());
        console.log(`✅ Organized ${streams.length} student streams`);
        setStudentStreams(streams);
    };

    const talkToAll = async () => {
        if (!localAudioTrack) {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await rtcClient.publish([audioTrack]);
            setLocalAudioTrack(audioTrack);
            console.log("🎤 Faculty started talking to all");
        }
    };

    const stopTalking = async () => {
        if (localAudioTrack) {
            await rtcClient.unpublish([localAudioTrack]);
            localAudioTrack.close();
            setLocalAudioTrack(null);
            console.log("🔇 Faculty stopped talking");
        }
    };

    const listenToStudent = (studentUid: any) => {
        const user = rtcClient.remoteUsers.find(u => String(u.uid) === String(studentUid));
        if (user?.audioTrack) {
            user.audioTrack.play();
            console.log(`🔊 Listening to student ${studentUid}`);
        }
    };

    return {
        remoteUsers,
        studentStreams,
        talkToAll,
        stopTalking,
        listenToStudent,
    };
}