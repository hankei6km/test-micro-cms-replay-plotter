module.exports = {
  env: {
    // シークレット関連はここに定義せずに、デプロイ環境などで定義すること
    // 利用するときは getStaticProps などのビルド時に使われる関数か、
    // API Routes にすること(デプロイされたファイルに含まれないコードでのみ利用という意味) .
    //
    // BLOG_API_URL_BASE: 'url'
    // BLOG_API_KEY: 'secret-key'
  }
};
