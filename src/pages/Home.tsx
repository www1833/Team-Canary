import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { GalleryStrip } from "@/components/Gallery/GalleryStrip";
import { Member } from "@/types/member";
import { Photo } from "@/types/photo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HomeProps {
  members: Member[];
  photos: Photo[];
}

const stats = [
  { label: "年間勝利数", value: 18 },
  { label: "チーム在籍", value: 32 },
  { label: "年間練習日", value: 96 },
  { label: "獲得トロフィー", value: 5 }
];

const Home = ({ members, photos }: HomeProps) => {
  return (
    <div className="space-y-20">
      <Hero />

      <Section title="トップギャラリー" description="試合や練習のハイライトをピックアップ。クリックで拡大表示できます。">
        {photos.length > 0 ? (
          <GalleryStrip photos={photos.slice(0, 8)} />
        ) : (
          <div className="rounded-3xl border border-dashed border-canaria-dark/20 p-12 text-center text-slate-500">
            写真がまだありません。管理画面から追加してください。
          </div>
        )}
      </Section>

      <Section
        id="about"
        title="カナリア軍団について"
        description="地域を拠点に活動する草野球チーム。勝利へのこだわりと、仲間を思いやる気持ちを大切にしています。"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-slate-600">
            <p>
              カナリア軍団は、地域の野球好きが集まって結成されたクラブチームです。明るく前向きなチームカラーを象徴するイエローとグリーンを身にまとい、週末には練習や練習試合で汗を流しています。
            </p>
            <p>
              実力向上だけでなく、地域イベントでのボランティアや、次世代の野球少年少女への指導にも力を入れています。勝ち負けを超えた、コミュニティとしてのつながりも大切にしています。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl bg-white p-6 text-center shadow"
              >
                <p className="text-3xl font-bold text-canaria-green">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="メンバー紹介" description="主力選手やコーチ陣の一部をご紹介します。">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.slice(0, 6).map((member) => (
            <div key={member.id} className="rounded-2xl border border-canaria-dark/10 bg-white/80 p-6 shadow">
              <div className="flex items-center gap-4">
                <img src={member.photoUrl} alt={member.name} className="h-20 w-20 rounded-full object-cover" />
                <div>
                  <p className="text-lg font-semibold text-canaria-dark">{member.name}</p>
                  <p className="text-sm text-slate-500">#{member.number} / {member.position.join("・")}</p>
                </div>
              </div>
              {member.bio && <p className="mt-4 text-sm text-slate-600">{member.bio}</p>}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/members">メンバーをもっと見る</Link>
          </Button>
        </div>
      </Section>

      <Section
        title="参加案内"
        description="体験参加は随時受付中。練習は土日の午前中、都内野球場を中心に行っています。お気軽にご連絡ください。"
      >
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-6 shadow">
            <h3 className="text-lg font-semibold text-canaria-dark">練習日</h3>
            <p className="mt-2 text-sm text-slate-600">毎週土・日曜日 9:00〜12:00</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 shadow">
            <h3 className="text-lg font-semibold text-canaria-dark">活動場所</h3>
            <p className="mt-2 text-sm text-slate-600">都内および近郊の野球場（江東区夢の島スタジアムなど）</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 shadow">
            <h3 className="text-lg font-semibold text-canaria-dark">お問い合わせ</h3>
            <p className="mt-2 text-sm text-slate-600">メール: info@canaria.example / X: @canaria_baseball</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
