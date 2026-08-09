export const studentProctoring = {
    joinLobby: (examId: string) => `/student/exam-rooms/${examId}/join`,
    getLobbyStatus: (assignmentId: string) => `/student/exam-rooms/lobby/${assignmentId}`,
    getLiveKitToken: (attemptId: string) => `/student/exams/attempts/${attemptId}/livekit-token`,
    sendChat: (roomId: string) => `/student/exam-rooms/${roomId}/chat`,
    getChatHistory: (roomId: string) => `/student/exam-rooms/${roomId}/chat`,
};
