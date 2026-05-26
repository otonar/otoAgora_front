# otoAgora フロントエンド

> 人ではなく「思想・主張」に同意・フォローする、議論ベースSNSのフロントエンド

**デモ:** https://agora-app-ruddy.vercel.app  
**バックエンドAPI:** https://agora-api.otoagora.workers.dev/docs

---

## 技術スタック

| 役割 | 技術 | 採用理由 |
|------|------|---------|
| フレームワーク | Next.js 15 (App Router) | RSC、SSR/SSG、Vercel最適化 |
| スタイリング | Tailwind CSS v4 | ユーティリティファースト、ビルドサイズ小 |
| 状態管理 | Zustand | 軽量、localStorage永続化が簡単 |
| デプロイ | Vercel | Next.jsと最も相性が良い |
| 言語 | TypeScript | 型安全 |

---

## 画面一覧

| パス | 説明 | レンダリング |
|------|------|------------|
| `/` | 議題一覧（ホーム） | SSR |
| `/topics/new` | 議題作成 | Client |
| `/topics/:id` | 議題詳細・主張一覧 | SSR |
| `/perspectives` | 思想・立場一覧 | SSR |
| `/feed` | フォロー中の思想フィード | Client |
| `/login` | ログイン | Client |
| `/register` | 新規登録 | Client |

---

## 認証フロー

```
1. /register または /login でAPIにリクエスト
2. JWTトークンを取得
3. Zustand store に保存（localStorage に永続化）
4. 以降のAPIリクエストに Authorization: Bearer <token> を付与
5. ログアウト時に store をクリア
```

---

## ローカル開発

```bash
git clone <this-repo>
cd agora-app
npm install
```

`.env.local` を作成:

```env
NEXT_PUBLIC_API_URL=https://agora-api.otoagora.workers.dev
```

開発サーバー起動:

```bash
npm run dev
```

http://localhost:3000 で開く。

### 主要コマンド

```bash
npm run dev      # 開発サーバー
npm run build    # 本番ビルド
npm run lint     # ESLintチェック
```

---

## デプロイ

```bash
# 初回
npx vercel

# 本番
npx vercel --prod
```

環境変数をVercelに設定:

```bash
npx vercel env add NEXT_PUBLIC_API_URL
# → https://agora-api.otoagora.workers.dev
```

---

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx               # ルートレイアウト（NavBar含む）
│   ├── page.tsx                 # ホーム（議題一覧）
│   ├── topics/
│   │   ├── new/page.tsx         # 議題作成
│   │   └── [id]/page.tsx        # 議題詳細
│   ├── perspectives/page.tsx    # 思想一覧
│   ├── feed/page.tsx            # フィード
│   ├── login/page.tsx           # ログイン
│   └── register/page.tsx        # 新規登録
├── components/
│   ├── NavBar.tsx                    # ナビゲーション
│   ├── ThesisCard.tsx                # 主張カード（同意ボタン付き）
│   ├── PerspectiveCard.tsx           # 思想カード（フォローボタン付き）
│   ├── NewThesisFormClient.tsx       # 主張投稿フォーム
│   └── NewPerspectiveFormClient.tsx  # 思想作成フォーム
├── lib/
│   ├── api.ts              # APIクライアント（fetch wrapper）
│   └── store.ts            # Zustand認証ストア
└── types/
    └── index.ts            # 共通型定義
```

---

## バックエンドとの関係

```
agora-app（このリポジトリ）
  └─ NEXT_PUBLIC_API_URL → otoGame（バックエンド）
                              └─ Cloudflare Workers
                                    └─ Neon PostgreSQL
```
