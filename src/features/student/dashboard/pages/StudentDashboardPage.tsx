import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";

const StudentDashboardPage = () => {

    return (
        <>
            <PageHeader>Dashboard</PageHeader>
            <Container>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-xl">Student Dashboard Page</h1>
                </div>
            </Container >
        </>
    )
}

export default StudentDashboardPage;