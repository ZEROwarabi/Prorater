# 🎓 ProRater

> 履修登録を劇的に楽にする、学生のための教授・授業評価比較プラットフォーム。
> Easily compare professors and courses for better registration decisions.

![ProRater Screenshot](https://via.placeholder.com/1000x500?text=Insert+Screenshot+Here) 
*(※ここに実際のスクリーンショットを配置してください)*

## 🌟 Overview
ProRaterは、大学の授業や教授のレビューを素早く検索し、比較できるWebアプリケーションです。
「Aの取りやすさ」「教授の質」「授業の質」などの指標を直感的なUIで可視化し、学生の履修計画を強力にサポートします。

## ✨ Features
- **🔍 スマート検索 (Smart Search)**: 教授名、科目名、分野名をスペース区切りで柔軟に検索可能。
- **📊 直感的な比較 (Intuitive Comparison)**: 最大4名の教授を並べて比較できる専用モードを搭載。
- **📱 レスポンシブ & モダンUI**: Tailwind CSSを用いたグラスモーフィズムを取り入れ、スマホでもPCでも快適な操作性を実現。
- **⚡ 高負荷への耐性 (High Performance)**: Next.jsの **ISR (Incremental Static Regeneration)** を活用。アクセス集中時でもデータベースに負荷をかけず、VercelのCDNから超高速にキャッシュを返します。

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide React
- **Backend / Database**: Supabase (PostgreSQL)
- **Security**: Row Level Security (RLS) によるアクセス制御（Read Only）
- **Hosting**: Vercel

## 🤖 AI-Assisted Development
本プロジェクトは、Googleが開発するAgentic AIアシスタント **「Antigravity」** とのペアプログラミングによって構築されました。

- **Agile Development**: 要件の壁打ちから実装まで、AIと対話しながら高速でプロトタイピングと改善を反復。
- **Code Quality & Architecture**: AIによるコードレビューを通し、TypeScriptの型定義の厳格化、コンポーネント描画のパフォーマンス最適化、Supabaseのセキュリティ(RLS)検証、ISRを用いたスケーラブルなインフラ設計など、本番環境を見据えた堅牢なアーキテクチャを実現しています。
- **Prompt Engineering**: 単なるコード自動生成としてではなく、AIを「設計パートナー」として活用するモダンな開発フローを実践しています。

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Supabase Account

### Installation

1. Clone the repository
```bash
git clone https://github.com/kei0205/Prorater.git
cd prorater
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory and add your Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
