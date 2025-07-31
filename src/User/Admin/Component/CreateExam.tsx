const CreateExam = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-9xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-primary text-whiteColor p-4">
                            <h1 className="text-2xl font-semibold flex items-center">
                                Create Exam
                            </h1>
                        </div>

                        <div className="p-4 space-y-8">
                            <form>
                                {/* Submit Button */}
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="submit"
                                        className="bg-primary text-whiteColor px-6 py-1.5 rounded-md focus:outline-none font-medium"
                                    >
                                        Create Exam
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateExam