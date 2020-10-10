# test-micro-cms-replay-plotter

[microCMS](https://microcms.io/) を試すためのリポジトリ。題材として [replayPlottert](https://hankei6km.github.io/posts/2020-08-hugo_shortcode_plotter/) を再構築する

## microCMS サービスの設定

いずれ書くかもしれません。

とりあえずプレビュー機能の設定。

1. デプロイ側に環境変数 `BLOG_PREVIEW_SECRET` を設定。 内容はとくに決まっていませんが、`uuidgen` などで作成するとよいかと。
1. microCMS 側で「API 設定/画面プレビュー設定」に以下のように設定。

```
https://<deployed-domain>/api/blog_preview?slug={CONTENT_ID}&draftKey={DRAFT_KEY}&previewSecret=********-****-****-****-************
```

※ プレビュー開始時の画面遷移にブラウザのアドレスバーに鍵が表示されてしまうので(編集している人には見えてしまう)、セキュリティ的には気休め程度に考えてください。

## 環境設定

開発環境およびデプロイ先の環境に、以下の環境変数が必要です。

| 変数名              | 内容        | 例                                            |
| ------------------- | ----------- | --------------------------------------------- |
| BLOG_API_URL_BASE   | API の URL  | `https://<service>.microcms.io/api/v1/<name>` |
| BLOG_API_KEY        | API KEY     | `********-****-****-****-************`        |
| BLOG_PREVIEW_SECRET | PREVIEW KEY | `********-****-****-****-************`        |

## CodeSadnbox

[CodeSandbox](https://codesandbox.io/) の [Container Sandbox](https://codesandbox.io/post/codesandbox-containers-out-of-beta-improvements) としてインポートできます。

GitHubBox からは https://githubbox.com/hankei6km/test-micro-cms-replay-plotter

## サンプル

https://test-micro-cms-replay-plotter.vercel.app/ から実際に動作するサイトが確認できます。

## ライセンス

MIT License

Copyright (c) 2020 hankei6km

テンプレート: This is a starter template for [Learn Next.js](https://nextjs.org/learn).
