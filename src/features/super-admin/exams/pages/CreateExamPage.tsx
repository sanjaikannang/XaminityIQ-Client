import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import { useCreateExamMutation } from '../../../../state/services/endpoints/exam';
import CreateExamForm, { CreateExamFormValues } from '../components/CreateExamForm';

const CreateExamPage = () => {
    const navigate = useNavigate();
    const [createExam, { isLoading: isCreating }] = useCreateExamMutation();

    const handleCreateExam = async (values: CreateExamFormValues) => {
        try {
            const response = await createExam(values).unwrap();
            toast.success(response.message || 'Exam created successfully!');
            navigate('/super-admin/exams');
        } catch (error) {
            throw error;
        }
    };

    const handleCancel = () => {
        navigate('/super-admin/exams');
    };

    return (
        <>
            <PageHeader>Create New Exam</PageHeader>
            <Container>
                <div className="py-6">
                    <div className="bg-whiteColor rounded-lg shadow-sm border border-borderLight p-6">
                        <CreateExamForm
                            onSubmit={handleCreateExam}
                            onCancel={handleCancel}
                            isLoading={isCreating}
                        />
                    </div>
                </div>
            </Container>
        </>
    );
};

export default CreateExamPage;