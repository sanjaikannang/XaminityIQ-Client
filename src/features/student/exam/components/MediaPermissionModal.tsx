import React, { useState, useEffect } from "react";

interface MediaPermissionModalProps {
    isOpen: boolean;
    onPermissionGranted: () => void;
    onCancel: () => void;
}

export const MediaPermissionModal: React.FC<MediaPermissionModalProps> = ({
    isOpen,
    onPermissionGranted,
    onCancel,
}) => {
    const [audioPermission, setAudioPermission] = useState(false);
    const [videoPermission, setVideoPermission] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPermissions = async () => {
        setIsRequesting(true);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });

            setAudioPermission(true);
            setVideoPermission(true);

            stream.getTracks().forEach((track) => track.stop());

            setTimeout(() => {
                onPermissionGranted();
            }, 500);
        } catch (err: any) {
            setError(
                err.message || "Failed to access camera and microphone. Please allow permissions."
            );
            setIsRequesting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setAudioPermission(false);
            setVideoPermission(false);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Media Permissions Required
                    </h2>

                    <p className="text-gray-600 mb-6">
                        To join the exam, we need access to your camera and microphone to ensure exam integrity.
                    </p>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${audioPermission ? "bg-green-100" : "bg-gray-200"
                                }`}>
                                {audioPermission ? (
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-gray-800">Microphone</h3>
                                <p className="text-sm text-gray-500">Required for audio communication</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${videoPermission ? "bg-green-100" : "bg-gray-200"
                                }`}>
                                {videoPermission ? (
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-gray-800">Camera</h3>
                                <p className="text-sm text-gray-500">Required for video proctoring</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isRequesting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={requestPermissions}
                            disabled={isRequesting || (audioPermission && videoPermission)}
                            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${isRequesting || (audioPermission && videoPermission)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {isRequesting ? "Requesting..." : audioPermission && videoPermission ? "Joining..." : "Allow Access"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};