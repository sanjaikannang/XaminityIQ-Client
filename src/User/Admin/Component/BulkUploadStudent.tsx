import { Upload } from 'lucide-react';

const BulkUploadStudent = () => {

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 bg-white">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Bulk Upload Students</h1>
                </div>

                {/* Upload Area */}
                <div className="mb-8">
                    <div
                        className="relative border-2 border-dashed border-gray-400 rounded-lg p-8 text-center transition-colors"
                    >
                        <input
                            type="file"
                            accept=".csv"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 mb-4 text-green-500" />
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-700 mb-1">
                                    Drop your CSV file here, or click to browse
                                </p>
                                <p className="text-sm text-gray-500">Supports CSV files only</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        className="px-6 py-1.5 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center cursor-pointer">
                        Upload
                    </button>
                </div>
            </div>
        </>
    );
};

export default BulkUploadStudent;