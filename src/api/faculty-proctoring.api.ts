export const facultyProctoring = {
    getMyExamRooms: () => "/faculty/exam-rooms",
    getExamRoomDetail: (roomId: string) => `/faculty/exam-rooms/${roomId}`,
    admitStudent: (roomId: string, assignmentId: string) => `/faculty/exam-rooms/${roomId}/assignments/${assignmentId}/admit`,
    rejectStudent: (roomId: string, assignmentId: string) => `/faculty/exam-rooms/${roomId}/assignments/${assignmentId}/reject`,
    removeStudent: (roomId: string, assignmentId: string) => `/faculty/exam-rooms/${roomId}/assignments/${assignmentId}/remove`,
    sendChat: (roomId: string) => `/faculty/exam-rooms/${roomId}/chat`,
    getChatHistory: (roomId: string) => `/faculty/exam-rooms/${roomId}/chat`,
    getLiveKitToken: (roomId: string) => `/faculty/exam-rooms/${roomId}/livekit-token`,
};
