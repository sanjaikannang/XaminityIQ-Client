import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";

const BatchesPage = () => {

    return (
        <>
            <PageHeader>Batches</PageHeader>
            <Container>
                <div className="flex justify-center items-center h-screen">
                    <h1 className="text-xl">Batches Page</h1>
                </div>
            </Container>
        </>
    );
};

export default BatchesPage;