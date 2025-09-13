import React from "react";
import { Mic, VideoOff, TriangleAlert } from "lucide-react";

interface Student {
    id: string;
    name: string;
    rollNumber: string;
    stream?: any;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    connectionQuality: "excellent" | "good" | "poor" | "disconnected";
    warnings: string[];
    screenSharing: boolean;
    lastActivity: Date;
}

interface VideoTileProps {
    student: Student;
    index: number;
}

const VideoTile: React.FC<VideoTileProps> = ({ student }) => {
    return (
        <>
            <div className="relative bg-gray-900 rounded-md overflow-hidden shadow-lg transition-all duration-200">
                {/* Video Stream */}
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    {student.isVideoEnabled ? (
                        <video
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            playsInline
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <VideoOff className="w-8 h-8 mb-2" />
                            <span className="text-sm">Video Off</span>
                        </div>
                    )}
                </div>

                {/* Student Info Overlay */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
                    {student.name}
                </div>

                {/* Roll Number */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {student.rollNumber}
                </div>

                {/* Controls */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <div className="flex space-x-1">
                        <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xs text-xs font-medium cursor-pointer">
                            <Mic size={12} />
                        </button>
                        <button className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xs text-xs font-medium cursor-pointer">
                            <TriangleAlert size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoTile;
