import { Award, Building2, Calendar, GraduationCap, Briefcase } from "lucide-react"

// Education Interface
interface Education {
    level: string
    qualification: string
    institutionName: string
    boardOrUniversity: string
    yearOfPassing: string | number
    percentageOrCGPA: string | number
    remarks?: string
    specialization?: string
}

// Work Experience Interface
interface WorkExperience {
    role: string
    organization: string
    department?: string
    fromDate: string
    toDate?: string
    isCurrent: boolean
    experienceYears: number
    jobDescription?: string
    reasonForLeaving?: string
}

interface TimelineProps {
    type: 'education' | 'work'
    data: Education | WorkExperience
    isLast: boolean
}

const Timeline = ({ type, data, isLast }: TimelineProps) => {
    // Type guard to check if data is Education
    const isEducation = (_data: Education | WorkExperience): _data is Education => {
        return type === 'education'
    }

    // Type guard to check if data is WorkExperience
    const isWork = (_data: Education | WorkExperience): _data is WorkExperience => {
        return type === 'work'
    }

    return (
        <>
            <div className="relative flex gap-4 pb-8">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border-2 border-primary">
                        {type === 'education' ? (
                            <GraduationCap className="w-5 h-5 text-primary" />
                        ) : (
                            <Briefcase className="w-5 h-5 text-primary" />
                        )}
                    </div>
                    {!isLast && <div className="w-0.5 flex-1 bg-borderLight mt-2"></div>}
                </div>

                <div className="flex-1 pb-2">
                    <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                        {/* Education Timeline */}
                        {isEducation(data) && (
                            <>
                                <h4 className="font-semibold text-textPrimary mb-1">
                                    {data.level} - {data.qualification}
                                </h4>

                                <p className="text-sm text-textSecondary mb-3">
                                    {data.institutionName}
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-textSecondary">
                                        <Building2 className="w-4 h-4" />
                                        <span>{data.boardOrUniversity}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-textSecondary">
                                        <Calendar className="w-4 h-4" />
                                        <span>{data.yearOfPassing}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-textSecondary">
                                        <Award className="w-4 h-4" />
                                        <span>{data.percentageOrCGPA}</span>
                                    </div>

                                    {data.specialization && (
                                        <div className="flex items-center gap-2 text-textSecondary">
                                            <GraduationCap className="w-4 h-4" />
                                            <span>{data.specialization}</span>
                                        </div>
                                    )}
                                </div>

                                {data.remarks && (
                                    <p className="text-xs text-textTertiary mt-3 italic">
                                        {data.remarks}
                                    </p>
                                )}
                            </>
                        )}

                        {/* Work Experience Timeline */}
                        {isWork(data) && (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-textPrimary">
                                        {data.role}
                                    </h4>
                                    {data.isCurrent && (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-textSecondary mb-3">
                                    {data.organization}
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {data.department && (
                                        <div className="flex items-center gap-2 text-textSecondary">
                                            <Building2 className="w-4 h-4" />
                                            <span>{data.department}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-textSecondary">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(data.fromDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })} -{" "}
                                            {data.isCurrent ? "Present" : new Date(data.toDate!).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-textSecondary">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{data.experienceYears} years</span>
                                    </div>
                                </div>

                                {data.jobDescription && (
                                    <p className="text-xs text-textTertiary mt-3 italic">
                                        {data.jobDescription}
                                    </p>
                                )}

                                {data.reasonForLeaving && !data.isCurrent && (
                                    <p className="text-xs text-warning mt-2">
                                        <span className="font-semibold">Reason for leaving:</span> {data.reasonForLeaving}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Timeline