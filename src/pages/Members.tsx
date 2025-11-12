import { useMemo, useState } from "react";
import { Member, Position, ThrowBat } from "@/types/member";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MemberCard } from "@/components/MemberCard";
import { EmptyState } from "@/components/EmptyState";
import { Users } from "lucide-react";

interface MembersPageProps {
  members: Member[];
}

const positions: (Position | "")[] = ["", "P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"];
const throwBats: (ThrowBat | "")[] = ["", "右投右打", "右投左打", "左投左打", "左投右打"];

const sortMembers = (members: Member[], sort: string) => {
  const sorted = [...members];
  switch (sort) {
    case "number-desc":
      return sorted.sort((a, b) => b.number - a.number);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted.sort((a, b) => a.number - b.number);
  }
};

const MembersPage = ({ members }: MembersPageProps) => {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<Position | "">("");
  const [throwBat, setThrowBat] = useState<ThrowBat | "">("");
  const [sort, setSort] = useState("number-asc");

  const filtered = useMemo(() => {
    const results = members.filter((member) => {
      const matchQuery = query ? member.name.includes(query) : true;
      const matchPosition = position ? member.position.includes(position) : true;
      const matchThrowBat = throwBat ? member.throwBat === throwBat : true;
      return matchQuery && matchPosition && matchThrowBat;
    });
    return sortMembers(results, sort);
  }, [members, query, position, throwBat, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-12 rounded-3xl bg-white/90 p-8 shadow">
        <h1 className="text-3xl font-bold text-canaria-dark">メンバー紹介</h1>
        <p className="mt-2 text-slate-600">ポジションや投打で絞り込みできます。</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Input
            placeholder="名前で検索"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="md:col-span-2"
          />
          <Select value={position} onChange={(event) => setPosition(event.target.value as Position | "")}> 
            <option value="">全ポジション</option>
            {positions.filter(Boolean).map((pos) => (
              <option key={pos} value={pos as string}>
                {pos}
              </option>
            ))}
          </Select>
          <Select value={throwBat} onChange={(event) => setThrowBat(event.target.value as ThrowBat | "")}> 
            <option value="">すべての投/打</option>
            {throwBats.filter(Boolean).map((value) => (
              <option key={value} value={value as string}>
                {value}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="number-asc">背番号 昇順</option>
            <option value="number-desc">背番号 降順</option>
            <option value="name-asc">名前 A→Z</option>
            <option value="name-desc">名前 Z→A</option>
          </Select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="条件に一致するメンバーがいません"
          description="検索条件を変更してお試しください。"
        />
      ) : (
        <div className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersPage;
