import React, { useState, useEffect } from 'react';
import {
    Home,
    Sparkles,
    Settings,
    Wifi,
    Database,
    Shield,
    Rocket,
    ChevronDown,
    ChevronRight,
    User,
    UserCheck,
    GraduationCap,
    TestTube,
    FileText,
    Menu,
    X
} from 'lucide-react';

// Types
interface SubTopic {
    id: string;
    title: string;
    content?: string;
}

interface DocumentationSection {
    id: string;
    title: string;
    icon: string;
    emoji: string;
    subTopics: SubTopic[];
}

interface DocumentationData {
    sections: DocumentationSection[];
}

// Mock data structure - this would come from your JSON files in assets folder
const mockDocumentationData: DocumentationData = {
    sections: [
        {
            id: 'overview',
            title: 'Overview',
            icon: 'Home',
            emoji: '',
            subTopics: [
                { id: 'introduction', title: 'Introduction' },
                { id: 'problem-statement', title: 'Problem Statement' },
                { id: 'tech-stack', title: 'Tech Stack' },
                { id: 'app-architecture', title: 'App Architecture' },
                { id: 'system-diagram', title: 'System Diagram' },
                { id: 'roles-responsibilities', title: 'Roles and Responsibilities (Admin, Faculty, Student)' }
            ]
        },
        {
            id: 'features',
            title: 'Features',
            icon: 'Sparkles',
            emoji: '',
            subTopics: [
                { id: 'proctoring-system', title: 'Proctoring System' },
                { id: 'manual-proctoring', title: 'Manual Proctoring' },
                { id: 'automatic-proctoring', title: 'Automatic Proctoring' },
                { id: 'browser-lockdown', title: 'Browser Lockdown' },
                { id: 'tab-focus-detection', title: 'Tab/Focus Change Detection' },
                { id: 'face-verification', title: 'Face Verification' },
                { id: 'camera-mic-detection', title: 'Camera/Mic Detection' },
                { id: 'randomized-questions', title: 'Randomized Questions' },
                { id: 'live-chat-help', title: 'Live Chat/Help' },
                { id: 'exam-analytics', title: 'Exam Analytics' },
                { id: 'result-ranking', title: 'Result & Ranking Generation' },
                { id: 'notifications', title: 'Notifications & Reminders' }
            ]
        },
        {
            id: 'functionality',
            title: 'Functionality',
            icon: 'Settings',
            emoji: '',
            subTopics: [
                { id: 'user-authentication', title: 'User Authentication (Login, Signup, Roles)' },
                { id: 'create-exam', title: 'Create Exam & Question Paper' },
                { id: 'schedule-exam', title: 'Schedule Exam' },
                { id: 'join-take-exam', title: 'Join/Take Exam (Student Flow)' },
                { id: 'proctoring-action', title: 'Proctoring in Action' },
                { id: 'result-calculation', title: 'Result Calculation' },
                { id: 'admin-dashboard', title: 'Admin Dashboard' },
                { id: 'faculty-tools', title: 'Faculty Tools' },
                { id: 'student-profile', title: 'Student Profile' }
            ]
        },
        {
            id: 'api-reference',
            title: 'API Reference',
            icon: 'Wifi',
            emoji: '',
            subTopics: [
                { id: 'auth-apis', title: '🧑💼 Auth - /auth/login' },
                { id: 'admin-apis', title: '🧑💼 Admin APIs - /admin/create-user' },
                { id: 'faculty-apis', title: '👨🏫 Faculty APIs - /faculty/create-exam' },
                { id: 'student-apis', title: '👨🎓 Student APIs - /student/join-exam' },
                { id: 'proctoring-apis', title: '🧪 Proctoring APIs - /proctoring/start-session' }
            ]
        },
        {
            id: 'db-schema',
            title: 'DB Schema',
            icon: 'Database',
            emoji: '',
            subTopics: [
                { id: 'user-schema', title: 'User Schema' },
                { id: 'exam-schema', title: 'Exam Schema' },
                { id: 'question-schema', title: 'Question Schema' },
                { id: 'response-schema', title: 'Response Schema' },
                { id: 'proctoring-schema', title: 'Proctoring Schema' },
                { id: 'result-schema', title: 'Result Schema' }
            ]
        },
        {
            id: 'security',
            title: 'Security',
            icon: 'Shield',
            emoji: '',
            subTopics: [
                { id: 'authentication', title: 'Authentication (JWT, Refresh Token Strategy)' },
                { id: 'authorization', title: 'Authorization (Role-Based Access Control)' },
                { id: 'session-handling', title: 'Session Handling' },
                { id: 'browser-restrictions', title: 'Browser Restrictions' },
                { id: 'preventing-cheating', title: 'Preventing Cheating (Tab switch, Face recognition)' },
                { id: 'https-cookies', title: 'HTTPS & Secure Cookies' },
                { id: 'password-encryption', title: 'Password Encryption' },
                { id: 'ip-restrictions', title: 'IP Restrictions (if any)' }
            ]
        },
        {
            id: 'deployment',
            title: 'Deployment',
            icon: 'Rocket',
            emoji: '',
            subTopics: [
                { id: 'frontend-deployment', title: 'Frontend Deployment (Vite + React)' },
                { id: 'backend-deployment', title: 'Backend Deployment (NestJS)' },
                { id: 'mongodb-hosting', title: 'MongoDB Hosting (Atlas)' }
            ]
        }
    ]
};

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
    Home,
    Sparkles,
    Settings,
    Wifi,
    Database,
    Shield,
    Rocket,
    User,
    UserCheck,
    GraduationCap,
    TestTube,
    FileText
};

const Documentation: React.FC = () => {
    const [documentationData, setDocumentationData] = useState<DocumentationData>(mockDocumentationData);
    const [activeSection, setActiveSection] = useState<string>('overview');
    const [activeSubTopic, setActiveSubTopic] = useState<string>('introduction');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    // Function to load data from JSON files (you can implement this later)
    const loadDocumentationData = async () => {
        try {
            // Example of how you would load from assets folder:
            // const response = await fetch('/assets/documentation.json');
            // const data = await response.json();
            // setDocumentationData(data);

            // For now, using mock data
            setDocumentationData(mockDocumentationData);
        } catch (error) {
            console.error('Error loading documentation data:', error);
        }
    };

    useEffect(() => {
        loadDocumentationData();
    }, []);

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const selectSubTopic = (sectionId: string, subTopicId: string) => {
        setActiveSection(sectionId);
        setActiveSubTopic(subTopicId);
        setSidebarOpen(false); // Close sidebar on mobile after selection
    };

    const getIconComponent = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
    };

    const getCurrentContent = () => {
        const section = documentationData.sections.find(s => s.id === activeSection);
        const subTopic = section?.subTopics.find(st => st.id === activeSubTopic);

        return {
            sectionTitle: section?.title || 'Unknown Section',
            subTopicTitle: subTopic?.title || 'Unknown Topic',
            content: subTopic?.content || 'Content will be loaded here based on the selected topic. This is where you can display detailed information, code examples, diagrams, and explanations for each documentation section.'
        };
    };

    const currentContent = getCurrentContent();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-200">
                        <div className="flex items-center space-x-3">                           
                            <h1 className="text-xl font-bold text-gray-900">Documentation</h1>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-2">
                        <div className="space-y-2">
                            {documentationData.sections.map((section) => (
                                <div key={section.id} className="space-y-1">
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{section.emoji}</span>
                                            {getIconComponent(section.icon)}
                                            <span className="font-medium text-gray-900">{section.title}</span>
                                        </div>
                                        {expandedSections.has(section.id) ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>

                                    {expandedSections.has(section.id) && (
                                        <div className="ml-6 space-y-1">
                                            {section.subTopics.map((subTopic) => (
                                                <button
                                                    key={subTopic.id}
                                                    onClick={() => selectSubTopic(section.id, subTopic.id)}
                                                    className={`
                            w-full text-left p-2 rounded-md text-sm transition-colors duration-200
                            ${activeSection === section.id && activeSubTopic === subTopic.id
                                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }
                          `}
                                                >
                                                    {subTopic.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 text-center">
                            Online Exam Portal Documentation
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 p-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{currentContent.subTopicTitle}</h1>
                                <p className="text-sm text-gray-500 mt-1">{currentContent.sectionTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                                <span>Last updated: Today</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            {/* Breadcrumb */}
                            <nav className="mb-6">
                                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                                    <li>Documentation</li>
                                    <li className="flex items-center space-x-2">
                                        <ChevronRight className="w-4 h-4" />
                                        <span>{currentContent.sectionTitle}</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="text-gray-900 font-medium">{currentContent.subTopicTitle}</span>
                                    </li>
                                </ol>
                            </nav>

                            {/* Content */}
                            <div className="prose prose-lg max-w-none">
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                        {currentContent.subTopicTitle}
                                    </h1>
                                    <div className="text-gray-600 leading-relaxed">
                                        {currentContent.content}
                                    </div>
                                </div>

                                {/* Placeholder for dynamic content */}
                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Content Loading Area</h3>
                                    <p className="text-gray-500">
                                        This is where the detailed content for "{currentContent.subTopicTitle}" will be displayed.
                                        Content will be loaded from JSON files in the assets folder based on the selected topic.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Documentation;