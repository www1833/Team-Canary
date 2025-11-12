import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, ensureDefaultHash, isSessionActive } from "@/lib/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureDefaultHash().catch(console.error);
    if (isSessionActive()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate("/admin");
    } else {
      setError("ログインに失敗しました。IDまたはパスワードをご確認ください。");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white/90 p-10 shadow">
      <h1 className="text-2xl font-bold text-canaria-dark">管理者ログイン</h1>
      <p className="mt-2 text-sm text-slate-500">静的サイト向けの簡易ログインです。機密性には限界があることにご留意ください。</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-canaria-dark">ID</label>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
        </div>
        <div>
          <label className="text-sm font-medium text-canaria-dark">パスワード</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
