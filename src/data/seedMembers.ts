import { Member } from "@/types/member";
import { Photo } from "@/types/photo";

export const seedMembers: Member[] = [
  {
    id: "1",
    number: 10,
    name: "山田 翔太",
    position: ["SS", "2B"],
    throwBat: "右投右打",
    height: 178,
    weight: 72,
    bio: "俊敏な守備とリーダーシップでチームを牽引する主将。",
    photoUrl:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=600&q=80",
    isCaptain: true,
    order: 1
  },
  {
    id: "2",
    number: 27,
    name: "佐藤 大和",
    position: ["P"],
    throwBat: "左投左打",
    height: 183,
    weight: 80,
    bio: "切れ味鋭いスライダーが武器のエースピッチャー。",
    photoUrl:
      "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=600&q=80",
    order: 2
  },
  {
    id: "3",
    number: 1,
    name: "田中 海斗",
    position: ["C"],
    throwBat: "右投右打",
    bio: "鉄壁のディフェンスで投手陣を支える女房役。",
    photoUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    order: 3
  },
  {
    id: "4",
    number: 55,
    name: "井上 翔",
    position: ["RF", "DH"],
    throwBat: "右投左打",
    bio: "豪快なスイングでチームを盛り上げるスラッガー。",
    photoUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
    order: 4
  },
  {
    id: "5",
    number: 8,
    name: "松本 菜摘",
    position: ["CF"],
    throwBat: "左投左打",
    bio: "スピードと守備範囲が自慢の外野手。",
    photoUrl:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=600&q=80",
    order: 5
  },
  {
    id: "6",
    number: 77,
    name: "小林 啓太",
    position: ["LF"],
    throwBat: "右投右打",
    bio: "堅実な打撃でチャンスメイクするリードオフマン。",
    photoUrl:
      "https://images.unsplash.com/photo-1521093470119-a3acdc43374b?auto=format&fit=crop&w=600&q=80",
    order: 6
  },
  {
    id: "7",
    number: 90,
    name: "中村 誠",
    position: ["1B"],
    throwBat: "右投右打",
    bio: "経験豊富なベテランコーチ。",
    photoUrl:
      "https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?auto=format&fit=crop&w=600&q=80",
    isCoach: true,
    order: 7
  }
];

export const seedPhotos: Photo[] = [
  {
    id: "p1",
    title: "勝利のハイタッチ",
    description: "リーグ戦勝利後の歓喜の瞬間",
    src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80",
    featured: true,
    order: 1
  },
  {
    id: "p2",
    title: "練習風景",
    src: "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=400&q=80",
    tags: ["練習"],
    featured: true,
    order: 2
  },
  {
    id: "p3",
    title: "円陣",
    src: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=400&q=80",
    tags: ["集合写真"],
    featured: true,
    order: 3
  },
  {
    id: "p4",
    title: "守備練習",
    src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80",
    tags: ["練習"],
    order: 4
  }
];
