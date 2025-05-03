# 作業ログ

## 2024-04-29
- プロジェクトルールの作成
  - Todoリストの作成
  - 作業ログの作成
  - アプリイメージの確認（appImage.mdを使用）
  - 作業フローの詳細化
    - タスク管理プロセスの定義
    - 作業ログ記録方法の詳細化
    - ドキュメント管理プロセスの定義
    - 開発フローの追加
    - レビュープロセスの追加
  - 技術構成の決定
    - フロントエンド技術の選定（React Native + Expo）
    - バックエンド技術の選定（Firebase）
    - データベースの選定（Firebase Realtime Database）
    - 開発ツールの選定
- 認証画面イメージをappImage.mdに追記
- todo.mdの「認証機能の実装」タスクを進行中に変更
- 認証画面UI（タブ切り替え・ソーシャルログインボタン・利用規約リンク）をAuthScreen.tsxとして実装
- index.tsxを書き換えて認証画面の動作確認を実施（その後元に戻す）
- アプリ名を「HabitStack（ハビスタ）」に決定し、appImage.mdや認証画面に反映
- 認証画面のロゴ下のアプリ名を「HabitStack」に変更
- Firebaseプロジェクト作成、バンドルID/パッケージ名の設定、Webアプリ用firebaseConfig取得
- Firebase SDK導入・初期化（firebase.ts）
- Firebase Auth用の認証関数（signUp, signIn）をfirebaseAuth.tsに実装
- AuthScreenにメール/パスワード認証UI・ロジックを追加
- 認証成功時にTOP画面へ遷移する処理を実装
- expo-routerの画面遷移方法の調整
- 3日間ローカル利用→4日目以降ログイン推奨の仕様を決定
- 初回起動日保存・3日経過判定のユーティリティ（firstLaunch.ts）を実装
- Todoリストに関連タスクを追加
- メイン画面のヘッダー非表示対応
  - currentChecklistがnullのときHeaderコンポーネント自体を表示しないようindex.tsxを修正
  - これにより「ルーティンリスト」文言も含めヘッダーが一切表示されなくなった
- タスク実績管理・ヒートマップ表示の要望を受領
  - タスク完了履歴を日付ごとに保存し、メイン画面でヒートマップとして可視化する機能をtodoに追加

## 2025-05-03
- 依存パッケージの解決・エラー修正対応
  - storage.ts, theme.ts, quotes.ts などのユーティリティ新規作成
  - lucide-react-nativeの依存衝突により@expo/vector-iconsへ全面置換
  - theme.tsにspacing, typography, shadowsを追加しimportエラー解消
  - firebase, @react-native-async-storage/async-storage, tslib などの依存パッケージを再インストール
  - node_modules, package-lock.json削除→npm installで依存関係を正常化
  - 金言取得用のquotes.tsを実装し、QuoteCardのエラー解消
  - 各種importパス・型エラー・依存エラーの都度修正
- 依存エラーやimportエラー発生時の対処法を整理
  - パッケージの再インストール
  - node_modules削除＆再構築
  - エディタ・開発サーバーの再起動
  - バージョン不整合時はバージョン指定インストール

## 2024-05-XX
- expo-routerのTabs機能を使い、(tabs)ディレクトリとtabs.tsxを新規作成
- ホーム・ヒートマップ・設定の3タブを実装
- ホームは既存のHome画面を流用、ヒートマップはTaskHeatmap＋ダミーデータ、設定は仮画面
- _layout.tsxのStack初期画面を(tabs)に変更
- todo.mdにタブナビゲーション実装タスクを追加・進行中に 