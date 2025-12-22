import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";

const DepartmentsPage = () => {

    return (
        <>
            <PageHeader>Departments</PageHeader>
            <Container>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-xl">Departments Page</h1>
                </div>
            </Container>
        </>
    );
};

export default DepartmentsPage;