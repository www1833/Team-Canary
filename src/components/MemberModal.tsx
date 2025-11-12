import { Member } from "@/types/member";
import { Avatar } from "./ui/avatar";

interface MemberModalProps {
  member: Member;
}

export const MemberModal = ({ member }: MemberModalProps) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <Avatar src={member.photoUrl} alt={`${member.name}の写真`} className="h-28 w-28" />
      <div className="space-y-2 text-sm text-slate-600">
        <h3 className="text-xl font-semibold text-canaria-dark">{member.name}</h3>
        <p>背番号: {member.number}</p>
        <p>ポジション: {member.position.join(" / ")}</p>
        <p>投/打: {member.throwBat}</p>
        {member.height && <p>身長: {member.height} cm</p>}
        {member.weight && <p>体重: {member.weight} kg</p>}
        {member.bio && <p className="whitespace-pre-wrap text-slate-600">{member.bio}</p>}
      </div>
    </div>
  );
};
