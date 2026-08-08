import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { SubjectData } from "../../../../types/subjects-types";
import { useGetStudentSubjectsQuery } from "../../../../state/services/endpoints/subjects";

const SubjectsPage = () => {
    const { data, isLoading, isFetching } = useGetStudentSubjectsQuery();
    const subjects = data?.data || [];

    const columns: ColumnDef<SubjectData, any>[] = [
        { accessorKey: "subjectCode", header: "Subject Code" },
        { accessorKey: "subjectName", header: "Subject Name" },
        { accessorKey: "credits", header: "Credits" },
        { accessorKey: "subjectType", header: "Type" },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ getValue }: { getValue: () => string }) => getValue() || '-',
        },
    ];

    return (
        <>
            <PageHeader>My Subjects</PageHeader>
            <Container>
                <div className="py-6">
                    <Table
                        columns={columns}
                        data={subjects}
                        totalCount={subjects.length}
                        pageNumber={1}
                        pageLimit={subjects.length || 10}
                        totalPages={1}
                        onPageChange={() => { }}
                        onPageSizeChange={() => { }}
                        isLoading={isLoading || isFetching}
                        tableTitle="Subjects"
                    />
                </div>
            </Container>
        </>
    );
};

export default SubjectsPage;
