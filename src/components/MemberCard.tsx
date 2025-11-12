import { Member } from "@/types/member";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "./ui/dialog";
import { MemberModal } from "./MemberModal";

interface MemberCardProps {
  member: Member;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-left">
          <Card className="h-full">
            <CardHeader className="items-center text-center">
              <Avatar src={member.photoUrl} alt={`${member.name}の写真`} className="h-24 w-24" />
              <CardTitle className="mt-4 flex items-center gap-2 text-xl">
                <span>{member.name}</span>
                {member.isCaptain && <Badge>CAPTAIN</Badge>}
                {member.isCoach && <Badge className="bg-canaria-green text-white">COACH</Badge>}
              </CardTitle>
              <p className="text-sm text-slate-500">#{member.number}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-slate-600">
              <p>ポジション: {member.position.join(" / ")}</p>
              <p>投/打: {member.throwBat}</p>
              {member.bio && <p className="line-clamp-3 text-slate-500">{member.bio}</p>}
            </CardContent>
          </Card>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>メンバー詳細</DialogTitle>
        </DialogHeader>
        <MemberModal member={member} />
        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
