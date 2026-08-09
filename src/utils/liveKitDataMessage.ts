// Wire format for LiveKit data-channel chat messages, shared by the student and
// faculty proctoring pages so both sides agree on the same JSON shape.

export interface LiveKitChatPayload {
    type: 'chat';
    message: string;
    senderRole: 'STUDENT' | 'FACULTY';
    senderIdentity: string;
    sentAt: string;
}

export function encodeChatPayload(payload: LiveKitChatPayload): Uint8Array<ArrayBuffer> {
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    const buffer = new Uint8Array(new ArrayBuffer(encoded.byteLength));
    buffer.set(encoded);
    return buffer;
}

export function decodeChatPayload(data: Uint8Array): LiveKitChatPayload | null {
    try {
        const parsed = JSON.parse(new TextDecoder().decode(data));
        if (parsed?.type === 'chat') return parsed as LiveKitChatPayload;
        return null;
    } catch {
        return null;
    }
}
