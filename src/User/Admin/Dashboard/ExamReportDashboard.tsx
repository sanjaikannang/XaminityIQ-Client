import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Eye, SkipForward, Clock, Monitor, Camera, AlertTriangle, FileText, TrendingUp, User, Video, Mic, Activity } from 'lucide-react';

interface ExamReport {
    studentInfo: {
        name: string;
        rollNumber: string;
        email: string;
        batch: string;
        course: string;
        department: string;
        section: string;
    };
    examInfo: {
        subject: string;
        examMode: 'AUTO' | 'PROCTORING';
        scheduledDate: string;
        startTime: string;
        endTime: string;
        duration: string;
        totalMarks: number;
        obtainedMarks: number | null;
    };
    questionStats: {
        totalQuestions: number;
        answered: number;
        notAnswered: number;
        skipped: number;
        reviewed: number;
        markedForReview: number;
    };
    behaviorMetrics: {
        tabSwitches: number;
        eyeContactWarnings: number;
        faceMissingWarnings: number;
        multiplePersonWarnings: number;
        audioAnomalies: number;
        suspiciousActivityCount: number;
        totalWarnings: number;
    };
    timeMetrics: {
        totalTimeSpent: string;
        averageTimePerQuestion: string;
        longestTimeOnQuestion: string;
        shortestTimeOnQuestion: string;
        idleTime: string;
    };
    recordingInfo: {
        screenRecordingUrl: string;
        videoRecordingUrl: string;
        audioRecordingUrl: string;
        recordingDuration: string;
        recordingSize: string;
    };
    submissionInfo: {
        submittedAt: string;
        submissionStatus: 'On Time' | 'Late' | 'Force Submitted';
        lateBy: string | null;
        autoSaved: boolean;
        lastAutoSaveTime: string;
    };
}

const ExamReportDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'timeline' | 'recordings'>('overview');

    // Sample data
    const reportData: ExamReport = {
        studentInfo: {
            name: "Rajesh Kumar",
            rollNumber: "2021CS001",
            email: "rajesh.kumar@university.edu",
            batch: "2021-2025",
            course: "B.Tech",
            department: "Computer Science",
            section: "A"
        },
        examInfo: {
            subject: "Data Structures and Algorithms",
            examMode: "PROCTORING",
            scheduledDate: "2024-12-10",
            startTime: "10:00 AM",
            endTime: "12:00 PM",
            duration: "2h 00m",
            totalMarks: 100,
            obtainedMarks: null
        },
        questionStats: {
            totalQuestions: 50,
            answered: 42,
            notAnswered: 5,
            skipped: 3,
            reviewed: 28,
            markedForReview: 8
        },
        behaviorMetrics: {
            tabSwitches: 7,
            eyeContactWarnings: 12,
            faceMissingWarnings: 3,
            multiplePersonWarnings: 0,
            audioAnomalies: 5,
            suspiciousActivityCount: 2,
            totalWarnings: 22
        },
        timeMetrics: {
            totalTimeSpent: "1h 58m 32s",
            averageTimePerQuestion: "2m 22s",
            longestTimeOnQuestion: "8m 15s (Q#23)",
            shortestTimeOnQuestion: "0m 45s (Q#12)",
            idleTime: "3m 28s"
        },
        recordingInfo: {
            screenRecordingUrl: "/recordings/screen_2021CS001_exam123.mp4",
            videoRecordingUrl: "/recordings/video_2021CS001_exam123.mp4",
            audioRecordingUrl: "/recordings/audio_2021CS001_exam123.mp3",
            recordingDuration: "2h 00m 15s",
            recordingSize: "1.2 GB"
        },
        submissionInfo: {
            submittedAt: "11:58 AM",
            submissionStatus: "On Time",
            lateBy: null,
            autoSaved: true,
            lastAutoSaveTime: "11:57 AM"
        }
    };

    const getRiskLevel = (warnings: number): { color: string; text: string } => {
        if (warnings === 0) return { color: 'text-green-600 bg-green-50', text: 'Low Risk' };
        if (warnings <= 10) return { color: 'text-yellow-600 bg-yellow-50', text: 'Medium Risk' };
        return { color: 'text-red-600 bg-red-50', text: 'High Risk' };
    };

    const riskLevel = getRiskLevel(reportData.behaviorMetrics.totalWarnings);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {reportData.studentInfo.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{reportData.studentInfo.name}</h1>
                                <p className="text-gray-600">{reportData.studentInfo.rollNumber} • {reportData.studentInfo.email}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span>{reportData.studentInfo.course} - {reportData.studentInfo.department}</span>
                                    <span>•</span>
                                    <span>Section {reportData.studentInfo.section}</span>
                                    <span>•</span>
                                    <span>Batch {reportData.studentInfo.batch}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-semibold ${riskLevel.color}`}>
                            {riskLevel.text}
                        </div>
                    </div>
                </div>

                {/* Exam Info Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Subject</p>
                            <p className="font-semibold text-gray-900">{reportData.examInfo.subject}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Exam Mode</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${reportData.examInfo.examMode === 'PROCTORING'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                                }`}>
                                {reportData.examInfo.examMode}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Scheduled Date</p>
                            <p className="font-semibold text-gray-900">{reportData.examInfo.scheduledDate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Time Slot</p>
                            <p className="font-semibold text-gray-900">{reportData.examInfo.startTime} - {reportData.examInfo.endTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Duration</p>
                            <p className="font-semibold text-gray-900">{reportData.examInfo.duration}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Marks</p>
                            <p className="font-semibold text-gray-900">{reportData.examInfo.totalMarks}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8 px-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 border-b-2 font-semibold transition-colors ${activeTab === 'overview'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('behavior')}
                                className={`py-4 border-b-2 font-semibold transition-colors ${activeTab === 'behavior'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Behavior Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`py-4 border-b-2 font-semibold transition-colors ${activeTab === 'timeline'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Time Analysis
                            </button>
                            <button
                                onClick={() => setActiveTab('recordings')}
                                className={`py-4 border-b-2 font-semibold transition-colors ${activeTab === 'recordings'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Recordings
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Question Statistics */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Question Statistics</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-5 h-5 text-gray-600" />
                                                <p className="text-sm text-gray-600">Total</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-900">{reportData.questionStats.totalQuestions}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <p className="text-sm text-green-600">Answered</p>
                                            </div>
                                            <p className="text-2xl font-bold text-green-700">{reportData.questionStats.answered}</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <XCircle className="w-5 h-5 text-red-600" />
                                                <p className="text-sm text-red-600">Not Answered</p>
                                            </div>
                                            <p className="text-2xl font-bold text-red-700">{reportData.questionStats.notAnswered}</p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <SkipForward className="w-5 h-5 text-yellow-600" />
                                                <p className="text-sm text-yellow-600">Skipped</p>
                                            </div>
                                            <p className="text-2xl font-bold text-yellow-700">{reportData.questionStats.skipped}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="w-5 h-5 text-blue-600" />
                                                <p className="text-sm text-blue-600">Reviewed</p>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-700">{reportData.questionStats.reviewed}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="w-5 h-5 text-purple-600" />
                                                <p className="text-sm text-purple-600">For Review</p>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-700">{reportData.questionStats.markedForReview}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-gray-700">Completion Rate</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {Math.round((reportData.questionStats.answered / reportData.questionStats.totalQuestions) * 100)}%
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                                                style={{ width: `${(reportData.questionStats.answered / reportData.questionStats.totalQuestions) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submission Info */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Submission Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Submitted At</p>
                                            <p className="font-bold text-gray-900">{reportData.submissionInfo.submittedAt}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${reportData.submissionInfo.submissionStatus === 'On Time'
                                                ? 'bg-green-100 text-green-700'
                                                : reportData.submissionInfo.submissionStatus === 'Late'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {reportData.submissionInfo.submissionStatus}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Auto-Saved</p>
                                            <p className="font-bold text-gray-900">{reportData.submissionInfo.autoSaved ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Last Auto-Save</p>
                                            <p className="font-bold text-gray-900">{reportData.submissionInfo.lastAutoSaveTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'behavior' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Behavior & Security Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Monitor className="w-5 h-5 text-orange-600" />
                                                <p className="text-sm text-orange-600">Tab Switches</p>
                                            </div>
                                            <p className="text-3xl font-bold text-orange-700">{reportData.behaviorMetrics.tabSwitches}</p>
                                            <p className="text-xs text-orange-600 mt-1">Suspicious if &gt; 5</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Camera className="w-5 h-5 text-red-600" />
                                                <p className="text-sm text-red-600">Eye Contact Warnings</p>
                                            </div>
                                            <p className="text-3xl font-bold text-red-700">{reportData.behaviorMetrics.eyeContactWarnings}</p>
                                            <p className="text-xs text-red-600 mt-1">Looking away detected</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                                <p className="text-sm text-red-600">Face Missing</p>
                                            </div>
                                            <p className="text-3xl font-bold text-red-700">{reportData.behaviorMetrics.faceMissingWarnings}</p>
                                            <p className="text-xs text-red-600 mt-1">Face not in frame</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="w-5 h-5 text-purple-600" />
                                                <p className="text-sm text-purple-600">Multiple Persons</p>
                                            </div>
                                            <p className="text-3xl font-bold text-purple-700">{reportData.behaviorMetrics.multiplePersonWarnings}</p>
                                            <p className="text-xs text-purple-600 mt-1">&gt;1 face detected</p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Mic className="w-5 h-5 text-yellow-600" />
                                                <p className="text-sm text-yellow-600">Audio Anomalies</p>
                                            </div>
                                            <p className="text-3xl font-bold text-yellow-700">{reportData.behaviorMetrics.audioAnomalies}</p>
                                            <p className="text-xs text-yellow-600 mt-1">Unusual audio detected</p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="w-5 h-5 text-red-600" />
                                                <p className="text-sm text-red-600">Suspicious Activity</p>
                                            </div>
                                            <p className="text-3xl font-bold text-red-700">{reportData.behaviorMetrics.suspiciousActivityCount}</p>
                                            <p className="text-xs text-red-600 mt-1">AI flagged behavior</p>
                                        </div>
                                        <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-900 col-span-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="w-5 h-5 text-white" />
                                                <p className="text-sm text-white">Total Warnings</p>
                                            </div>
                                            <p className="text-3xl font-bold text-white">{reportData.behaviorMetrics.totalWarnings}</p>
                                            <p className="text-xs text-gray-300 mt-1">Combined alert count</p>
                                        </div>
                                    </div>

                                    {/* Risk Assessment */}
                                    <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-3">AI Risk Assessment</h4>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`px-4 py-2 rounded-lg font-bold text-lg ${riskLevel.color}`}>
                                                {riskLevel.text}
                                            </div>
                                            <div className="flex-1">
                                                <div className="w-full bg-gray-200 rounded-full h-4">
                                                    <div
                                                        className={`h-4 rounded-full transition-all ${reportData.behaviorMetrics.totalWarnings === 0
                                                            ? 'bg-green-500'
                                                            : reportData.behaviorMetrics.totalWarnings <= 10
                                                                ? 'bg-yellow-500'
                                                                : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min((reportData.behaviorMetrics.totalWarnings / 30) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {reportData.behaviorMetrics.totalWarnings === 0 && 'Student showed excellent exam behavior with no violations detected.'}
                                            {reportData.behaviorMetrics.totalWarnings > 0 && reportData.behaviorMetrics.totalWarnings <= 10 && 'Some minor violations detected. Recommend reviewing recordings for context.'}
                                            {reportData.behaviorMetrics.totalWarnings > 10 && 'Multiple violations detected. Manual review of recordings strongly recommended.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Time Analysis</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                                <p className="text-sm text-blue-600">Total Time Spent</p>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-700">{reportData.timeMetrics.totalTimeSpent}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-5 h-5 text-green-600" />
                                                <p className="text-sm text-green-600">Avg Time/Question</p>
                                            </div>
                                            <p className="text-2xl font-bold text-green-700">{reportData.timeMetrics.averageTimePerQuestion}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5 text-purple-600" />
                                                <p className="text-sm text-purple-600">Idle Time</p>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-700">{reportData.timeMetrics.idleTime}</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg col-span-1 md:col-span-2">
                                            <p className="text-sm text-orange-600 mb-2">Longest Time on Question</p>
                                            <p className="text-xl font-bold text-orange-700">{reportData.timeMetrics.longestTimeOnQuestion}</p>
                                        </div>
                                        <div className="bg-teal-50 p-4 rounded-lg">
                                            <p className="text-sm text-teal-600 mb-2">Shortest Time on Question</p>
                                            <p className="text-xl font-bold text-teal-700">{reportData.timeMetrics.shortestTimeOnQuestion}</p>
                                        </div>
                                    </div>

                                    {/* Time Distribution */}
                                    <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                                        <h4 className="font-bold text-gray-900 mb-4">Time Distribution Analysis</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm text-gray-600">Active Time</span>
                                                    <span className="text-sm font-semibold text-gray-900">97.1%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '97.1%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm text-gray-600">Idle Time</span>
                                                    <span className="text-sm font-semibold text-gray-900">2.9%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '2.9%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'recordings' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Exam Recordings</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Total Duration</p>
                                            <p className="font-bold text-gray-900">{reportData.recordingInfo.recordingDuration}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Total Size</p>
                                            <p className="font-bold text-gray-900">{reportData.recordingInfo.recordingSize}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Format</p>
                                            <p className="font-bold text-gray-900">MP4 / MP3</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Screen Recording */}
                                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Monitor className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">Screen Recording</h4>
                                                        <p className="text-sm text-gray-600">Complete screen capture during exam</p>
                                                        <p className="text-xs text-gray-500 mt-1">Duration: {reportData.recordingInfo.recordingDuration}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                                                        Play
                                                    </button>
                                                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold">
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Video Recording */}
                                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Video className="w-6 h-6 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">Video Recording</h4>
                                                        <p className="text-sm text-gray-600">Webcam footage of student</p>
                                                        <p className="text-xs text-gray-500 mt-1">Duration: {reportData.recordingInfo.recordingDuration}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
                                                        Play
                                                    </button>
                                                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold">
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Audio Recording */}
                                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <Mic className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">Audio Recording</h4>
                                                        <p className="text-sm text-gray-600">Audio captured during exam</p>
                                                        <p className="text-xs text-gray-500 mt-1">Duration: {reportData.recordingInfo.recordingDuration}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold">
                                                        Play
                                                    </button>
                                                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold">
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recording Info Alert */}
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 mb-1">Recording Information</h4>
                                                <p className="text-sm text-blue-800">
                                                    All recordings are securely stored and encrypted. Recordings are automatically deleted after 90 days as per privacy policy. Access to recordings is logged and monitored.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                        Export Report
                    </button>
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                        Flag for Review
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                        View Answer Sheet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamReportDashboard;