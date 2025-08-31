import { GuardianInfo, ParentInfo } from "../../Types/admin.types";
import { InfoItem } from "./InfoItem";

type Props = {
    title: string;
    member: ParentInfo | GuardianInfo;
};

export const FamilyMemberCard = ({ title, member }: Props) => {
    return (
        <>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm p-4">
                <div className="flex items-center mb-3">                   
                    <h4 className="text-md font-semibold text-gray-800 ml-2">{title}</h4>
                </div>
                <dl className="grid grid-cols-1 gap-2">
                    <InfoItem label="Name" value={member.name} />
                    <InfoItem label="Occupation" value={member.occupation} />
                    <InfoItem label="Phone" value={member.phone} />
                    <InfoItem label="Email" value={member.email} />
                    {/* Only show relationship for GuardianInfo */}
                    {'relationship' in member && member.relationship && (
                        <InfoItem label="Relationship" value={member.relationship} />
                    )}
                </dl>
            </div>
        </>
    );
};