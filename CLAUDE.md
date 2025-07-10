# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

宇田川 悠大さんのGitHubプロフィールREADMEを自動生成するシステムです。Handlebarsテンプレートエンジンを使用し、GitHub Actionsで定期的に更新されます。

## ディレクトリ構成

```
.
├── .devcontainer/
│   └── devcontainer.json              # Dev Container設定
├── .github/
│   ├── config/
│   │   └── readme-data.json           # プロフィール・技術データ
│   ├── scripts/
│   │   ├── generate-readme.js         # README生成スクリプト
│   │   └── validate-icons.js          # アイコンURL検証スクリプト
│   └── workflows/
│       ├── update-readme.yml          # README自動更新ワークフロー
│       └── validate-icons.yml         # アイコン検証ワークフロー
├── README.template.hbs                # Handlebarsテンプレート
├── README.md                          # 自動生成されるREADME
├── package.json                       # Node.js設定
└── .gitignore                         # Git無視ファイル
```

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# README生成（手動）
npm run generate-readme

# アイコンURL検証
npm run validate-icons

# アイコンテスト（エイリアス）
npm run test-icons
```

## システム構成

### 1. **データ管理**
- `.github/config/readme-data.json`: プロフィール情報・技術スタックを一元管理
- カテゴリ別技術分類（language, framework, cloud, devops, database, api）

### 2. **テンプレートエンジン**
- **Handlebars**: 動的コンテンツ生成
- **カスタムヘルパー**: 
  - `techIcon`: 技術アイコン生成
  - `filterByCategory`: カテゴリ別フィルタリング
  - `formatDate`: 日付フォーマット

### 3. **アイコン検証システム**
- 22個の技術アイコンのURL有効性を自動チェック
- 無効なアイコンの検出と修正候補提案
- GitHub Actionsでの自動検証
- ダークテーマでの視認性を考慮したアイコン選択（wordmarkバリエーション使用）

### 4. **GitHub Actions**
- **update-readme.yml**: mainブランチpush時に実行
- **validate-icons.yml**: PR時とマニュアル実行でアイコン検証
- 自動コミット・プッシュ機能

## 技術スタック

- **Node.js 22**: ES Modules使用
- **Handlebars**: テンプレートエンジン
- **DevIcons**: 技術アイコンライブラリ
- **GitHub Actions**: CI/CD自動化

## 運用ルール

1. **データ更新**: `.github/config/readme-data.json`を編集
2. **テンプレート修正**: `README.template.hbs`を編集
3. **自動生成**: README.mdは手動編集禁止（GitHub Actionsで自動生成）
4. **アイコン追加**: 必ず`npm run validate-icons`で検証
5. **アイコン選択**: ダークテーマでの視認性を考慮し、黒いアイコンは`-wordmark`バリエーションを使用
6. **プロフィール用途**: 宇田川さんのGitHubプロフィール表示

## アーキテクチャの特徴

- **保守性**: データとテンプレートの分離
- **拡張性**: 新技術やスキルの追加が容易
- **品質保証**: アイコンURL検証で表示エラー防止
- **視認性**: ダークテーマ対応でアイコンの見やすさを確保
- **自動化**: GitHub Actionsで運用負荷軽減