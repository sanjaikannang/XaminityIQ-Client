import { LayoutList, CalendarRange, GraduationCap, Layers3 } from 'lucide-react';

const MasterDataDashboard = () => {

    const entities = [
        {
            key: 'batch',
            title: 'Batches',
            total: 10,
            icon: CalendarRange,
            color: 'bg-blue-500',
        },
        {
            key: 'course',
            title: 'Courses',
            total: 14,
            icon: GraduationCap,
            color: 'bg-green-500',
        },
        {
            key: 'branch',
            title: 'Branches',
            total: 20,
            icon: Layers3,
            color: 'bg-purple-500',
        },
        {
            key: 'section',
            title: 'Sections',
            total: 16,
            icon: LayoutList,
            color: 'bg-orange-500',
        }
    ];

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Master Data</h1>
                    </div>

                    {/* Entity Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {entities.map((entity) => {
                            const IconComponent = entity.icon;
                            return (
                                <div key={entity.key} className="bg-white rounded-md shadow-md border border-gray-300">

                                    <div className="flex items-center justify-evenly border-b border-gray-300">
                                        <div>
                                            <IconComponent className="w-8 h-8 text-gray-600" />
                                        </div>

                                        {/* Vertical Divider */}
                                        <div className="w-px h-24 bg-gray-300 mx-2"></div>

                                        <div>
                                            <p className="font-medium text-3xl text-gray-600">{entity.total}</p>
                                            <p className="text-[10px] text-gray-600">{entity.title}</p>
                                        </div>

                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{entity.title}</h3>
                                        <div className="space-y-2">
                                            <button
                                                className="w-full bg-primary text-white px-4 py-2 rounded-md cursor-pointer flex items-center justify-center space-x-2"
                                            >
                                                <span>Create {entity.title}</span>
                                            </button>

                                            <button
                                                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer flex items-center justify-center space-x-2"
                                            >
                                                <span>View {entity.title}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MasterDataDashboard;