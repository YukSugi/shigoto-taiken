# 画像生成パイプライン（GitHub運用）

お仕事体験の設問に対して、シーン画像（設問）と解説画像（判定タイプ別）を
OpenAI の画像モデル（`gpt-image-2`）で生成し、参考サンプルのドット感・タッチに
揃っているかを `gpt-5.5` で検査してから本番反映する仕組みです。

重い生成処理は **GitHub Actions（クラウド）** で実行するので、PCを閉じても進みます。

## 3つのフォルダ

- `reference_images/` … 参考サンプル（画風の基準）。生成・類似度判定のアンカー
- `check_images/` … 生成済み・**レビュー待ち**（追跡対象）
- `public/images/` … **反映済み**＝本番にデプロイされる公開フォルダ

環境変数 `REFERENCE_DIR` / `CHECK_IMAGES_DIR` / `OUTPUT_IMAGES_DIR` で上書き可能。

## 全体フロー

1. **① トリガー** — `src/data/jobs/**` を push すると
   `.github/workflows/notify-new-questions.yml` が「🎨 画像生成が必要」Issue を作成。
   Claude の予約ルーティンがこれを検知して **Claudeアプリに通知**。
2. **② 生成（手動起動）** — GitHub の Actions →「Generate job images」を実行
   （`job` に jobId を指定）。または Claude に「marketerの画像を生成して」と指示。
   CI が②設問確認→③生成→④類似度チェック→⑤`check_images/` へコミットまで実行し、
   「🖼️ レビュー待ち」Issue を作成。
3. **③ レビュー** — `check_images/` の画像を確認。
4. **④ 承認 & デプロイ** — Claude に「**承認**」と伝えると、Claude が
   「Approve & deploy images」ワークフローを起動 → `check_images` を `public/images`
   へ移動してコミット → push → Vercel が自動デプロイ。

## セットアップ（最初の1回だけ）

GitHub Actions で生成を動かすため、OpenAI APIキーをリポジトリ Secret に登録します。

1. GitHub リポジトリ → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `OPENAI_API_KEY` / Secret: 自分のキー（`sk-...`）を貼り付け → 保存

ローカルで実行する場合は `.env`（コミットされません）に同じキーを設定。
モデル・しきい値などの設定は `.env.example` を参照。

## コマンド（ローカル実行も可）

```bash
npm run images:generate -- --list               # jobId 一覧
npm run images:generate -- marketer             # 不足画像だけ生成
npm run images:generate -- marketer --force     # 既存も含め全再生成
npm run images:generate -- marketer --only feedback_good  # 名前一致だけ生成
npm run images:approve                           # check_images → public/images へ反映＆push
```

## 命名規則

- シーン画像: `{sceneImagePrefix}_scene_{設問番号}_{male|female}.png`
- 解説画像 : `feedback_{判定タイプ}_{male|female}.png`

設問番号は並び順（1始まり）。**新規ジョブには `src/data/jobs/<id>.ts` に
`sceneImagePrefix` を必ず設定**してください（未設定はスキップ）。

## スクリプト

- `generate-images.ts` … ②〜⑤（生成＋類似度チェック＋ステージング）
- `approve-and-deploy.ts` … ⑥（反映＋push）
- `wait-and-generate.ts` … 課金枠が空くまで待って生成（ローカル用）
- `check-models.ts` … 利用可能な OpenAI モデルの確認
- `lib/` … 設定・ジョブ読込・OpenAI 呼び出し・通知のヘルパー
