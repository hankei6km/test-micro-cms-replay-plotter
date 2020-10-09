import axios from 'axios';

// getStaticProps 等のビルド時に実行される関数以外からは呼ばないように注意
// (getStaticProps は デプロイされるときに bundle されないはずだが、明記されたところは見たいことないような。。。)

// async にしても大丈夫? index.js では async から呼んでいるが、await はなかった
export async function getSortedPostsData() {
  try {
    const res = await axios(`${process.env.BLOG_API_URL_BASE}`, {
      methods: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    return res.data.contents.map(({ id, title, publishedAt }) => {
      return {
        id,
        title,
        date: publishedAt
        // date: new Date(publusedAt),
      };
    });
  } catch (err) {
    // TODO: ビルド時のエラーはどう扱うのが正解? 迂闊に response を表示するとシークレットが漏洩する可能性もある.
    const msg =
      err.response !== undefined
        ? `status=${err.response.status}, data=${err.response.data}`
        : `err=${err.name}`;
    console.error(`getSortedPostsData error: ${msg}`);
  }
  return [];
}

export async function getAllPostIds() {
  try {
    const res = await axios(`${process.env.BLOG_API_URL_BASE}`, {
      methods: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    return res.data.contents.map(({ id, title, publishedAt }) => {
      return {
        params: {
          id
        }
      };
    });
  } catch (err) {
    // TODO: ビルド時のエラーはどう扱うのが正解? 迂闊に response を表示するとシークレットが漏洩する可能性もある.
    const msg =
      err.response !== undefined
        ? `status=${err.response.status}, data=${err.response.data}`
        : `err=${err.name}`;
    console.error(`getAllPostIds error: ${msg}`);
  }
  return [];
}

export async function getPostData(id) {
  try {
    const res = await axios(`${process.env.BLOG_API_URL_BASE}/${id}`, {
      methods: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    // console.log(res.data.series);
    // Combine the data with the id and contentHtml
    return {
      id: res.data.id,
      contentHtml: res.data.content,
      //...matterResult.data
      title: res.data.title,
      date: res.data.publishedAt,
      series: res.data.series.map((e) => {
        return {
          name: e.name,
          data: JSON.parse(e.data)
        };
      })
    };
  } catch (err) {
    // TODO: ビルド時のエラーはどう扱うのが正解? 迂闊に response を表示するとシークレットが漏洩する可能性もある.
    const msg =
      err.response !== undefined
        ? `status=${err.response.status}, data=${err.response.data}`
        : `err=${err.name}`;
    console.error(`getPostData error: ${msg}`);
  }
  return {};
}
