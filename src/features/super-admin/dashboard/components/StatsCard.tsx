import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: number;
    color: string;
}

const StatsCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    color,
}) => {
    return (
        <>
            <div className="bg-whiteColor rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{title}</p>
                        <h3 className="text-3xl font-bold mt-2 text-gray-800">
                            {value.toLocaleString()}
                        </h3>
                        {trend !== undefined && (
                            <div className="flex items-center mt-2">
                                {trend >= 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                )}
                                <span
                                    className={`text-sm font-medium ${trend >= 0 ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {Math.abs(trend)}%
                                </span>
                                <span className="text-gray-400 text-xs ml-1">vs last month</span>
                            </div>
                        )}
                    </div>
                    <div className={`${color} p-3 rounded-lg`}>{icon}</div>
                </div>
            </div>
        </>
    )
}

export default StatsCard