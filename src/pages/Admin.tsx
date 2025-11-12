import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Member, MemberFormValues } from "@/types/member";
import { Photo } from "@/types/photo";
import { isSessionActive, logout, changePassword } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toolbar } from "@/components/Admin/Toolbar";
import { Button } from "@/components/ui/button";
import { MemberForm } from "@/components/Admin/MemberForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryManager } from "@/components/Admin/GalleryManager";
import { exportMembers, importMembers, exportPhotos, importPhotos } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminPageProps {
  members: Member[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
  photos: Photo[];
  setPhotos: Dispatch<SetStateAction<Photo[]>>;
}

interface SortableMemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

const SortableMemberCard = ({ member, onEdit, onDelete }: SortableMemberCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: member.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-2xl border border-canaria-dark/15 bg-white p-4 shadow-sm"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-canaria-dark">#{member.number} {member.name}</p>
          <p className="text-sm text-slate-500">{member.position.join(" / ")} / {member.throwBat}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(member)}>
            編集
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(member)}>
            削除
          </Button>
        </div>
      </div>
    </div>
  );
};

const downloadJson = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminPage = ({ members, setMembers, photos, setPhotos }: AdminPageProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showCaptainsOnly, setShowCaptainsOnly] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [passwordState, setPasswordState] = useState({ current: "", next: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSessionActive()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => (search ? member.name.includes(search) || member.position.join(",").includes(search) : true))
      .filter((member) => (showCaptainsOnly ? member.isCaptain : true))
      .sort((a, b) => (a.order ?? a.number) - (b.order ?? b.number));
  }, [members, search, showCaptainsOnly]);

  const handleAddMember = (values: MemberFormValues) => {
    setMembers((prev) => {
      const member: Member = {
        ...values,
        id: crypto.randomUUID(),
        order: prev.length + 1
      } as Member;
      return [...prev, member];
    });
    setAddOpen(false);
  };

  const handleUpdateMember = (values: MemberFormValues & { id?: string }) => {
    if (!editingMember) return;
    setMembers((prev) =>
      prev.map((member) => (member.id === editingMember.id ? { ...member, ...values, id: editingMember.id } : member))
    );
    setEditingMember(null);
  };

  const handleDeleteMember = (member: Member) => {
    if (!confirm(`${member.name} を削除しますか？`)) return;
    setMembers((prev) => prev.filter((item) => item.id !== member.id).map((item, index) => ({ ...item, order: index + 1 })));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    setMembers((prev) => {
      const oldIndex = prev.findIndex((member) => member.id === active.id);
      const newIndex = prev.findIndex((member) => member.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((member, index) => ({ ...member, order: index + 1 }));
    });
  };

  const handleMembersImport = (json: string) => {
    try {
      const imported = importMembers(json);
      setMembers(imported);
      alert("メンバーデータをインポートしました。");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handlePhotosImport = (json: string) => {
    try {
      const imported = importPhotos(json);
      setPhotos(imported);
      alert("ギャラリーデータをインポートしました。");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordState.next !== passwordState.confirm) {
      setPasswordMessage("新しいパスワードが一致しません。");
      return;
    }
    const success = await changePassword(passwordState.current, passwordState.next);
    setPasswordMessage(success ? "パスワードを変更しました。" : "現在のパスワードが違います。");
    if (success) {
      setPasswordState({ current: "", next: "", confirm: "" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="mb-10 flex flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-canaria-dark">管理ダッシュボード</h1>
          <p className="mt-2 text-sm text-slate-600">メンバーとギャラリーの管理、バックアップ、パスワード変更が行えます。</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { logout(); navigate("/admin/login"); }}>
            ログアウト
          </Button>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Toolbar
            onSearch={(value) => setSearch(value)}
            onImport={handleMembersImport}
            onExport={() => downloadJson("members.json", exportMembers())}
            searchPlaceholder="名前・ポジションで検索"
            actions={
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-canaria-dark">
                  <Checkbox checked={showCaptainsOnly} onCheckedChange={(checked) => setShowCaptainsOnly(Boolean(checked))} />
                  主将のみ
                </label>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>メンバーを追加</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新しいメンバーを追加</DialogTitle>
                    </DialogHeader>
                    <MemberForm onSubmit={handleAddMember} />
                  </DialogContent>
                </Dialog>
              </div>
            }
          />

          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={members.map((member) => member.id)}>
              <div className="grid gap-4">
                {filteredMembers.map((member) => (
                  <SortableMemberCard
                    key={member.id}
                    member={member}
                    onEdit={(item) => setEditingMember(item)}
                    onDelete={handleDeleteMember}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Dialog open={Boolean(editingMember)} onOpenChange={(open) => !open && setEditingMember(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>メンバーを編集</DialogTitle>
              </DialogHeader>
              {editingMember && (
                <MemberForm defaultValues={editingMember} onSubmit={handleUpdateMember} />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="gallery">
          <Toolbar
            onSearch={(_value) => {}}
            onImport={handlePhotosImport}
            onExport={() => downloadJson("photos.json", exportPhotos())}
          />
          <div className="mt-6">
            <GalleryManager photos={photos} onChange={setPhotos} />
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>パスワード変更</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePasswordChange}>
                <div>
                  <label className="text-sm font-medium text-canaria-dark">現在のパスワード</label>
                  <Input
                    type="password"
                    value={passwordState.current}
                    onChange={(event) => setPasswordState((prev) => ({ ...prev, current: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-canaria-dark">新しいパスワード</label>
                  <Input
                    type="password"
                    value={passwordState.next}
                    onChange={(event) => setPasswordState((prev) => ({ ...prev, next: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-canaria-dark">新しいパスワード（確認）</label>
                  <Input
                    type="password"
                    value={passwordState.confirm}
                    onChange={(event) => setPasswordState((prev) => ({ ...prev, confirm: event.target.value }))}
                  />
                </div>
                {passwordMessage && <p className="text-sm text-slate-600">{passwordMessage}</p>}
                <Button type="submit">変更する</Button>
              </form>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>静的サイトでの認証について</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                このサイトは完全にクライアントサイドで動作します。ログイン情報はブラウザのストレージに保存されるため、厳密な機密保持はできません。定期的なパスワード変更と、不要時のログアウトを推奨します。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
