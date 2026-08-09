// Holds the live MediaStreams acquired during pre-flight checks so the exam
// room page can reuse them without re-requesting camera/mic/screen permission.
// Deliberately a plain module-level store (not React state) since it must
// survive a route navigation between PreFlightCheckPage and ExamRoomPage.

interface ExamMediaStreams {
    video: MediaStream | null;
    audio: MediaStream | null;
    screen: MediaStream | null;
}

let streams: ExamMediaStreams = { video: null, audio: null, screen: null };

export const examMediaStore = {
    set(next: ExamMediaStreams) {
        streams = next;
    },
    get(): ExamMediaStreams {
        return streams;
    },
    clear() {
        Object.values(streams).forEach((stream) => stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop()));
        streams = { video: null, audio: null, screen: null };
    },
};
