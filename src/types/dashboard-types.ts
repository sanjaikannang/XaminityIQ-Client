export interface CountsSummary {
    totalStudents: number;
    activeStudents: number;
    totalFaculty: number;
    activeFaculty: number;
    totalDepartments: number;
    totalCourses: number;
    totalBatches: number;
    totalSubjects: number;
    totalExams: number;
    totalAttempts: number;
    flaggedAttempts: number;
}

export interface StatusCount {
    status: string;
    count: number;
}

export interface DepartmentDistribution {
    departmentId: string;
    departmentName: string;
    studentCount: number;
    facultyCount: number;
}

export interface RecentExam {
    examId: string;
    name: string;
    mode: string;
    status: string;
    createdAt: string;
}

export interface RecentActivity {
    email: string;
    role: string;
    action: string;
    createdAt: string;
}

export interface DashboardOverviewData {
    counts: CountsSummary;
    examsByStatus: StatusCount[];
    examsByMode: StatusCount[];
    attemptsByStatus: StatusCount[];
    departmentDistribution: DepartmentDistribution[];
    recentExams: RecentExam[];
    recentActivity: RecentActivity[];
}

export interface GetDashboardOverviewResponse {
    success: boolean;
    message: string;
    data?: DashboardOverviewData;
}
