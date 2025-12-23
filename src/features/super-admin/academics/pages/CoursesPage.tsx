import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";

const CoursesPage = () => {

    return (
        <>
            <PageHeader>Courses</PageHeader>
            <Container>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-xl">Courses Page</h1>
                </div>
            </Container>
        </>
    );
};

export default CoursesPage;