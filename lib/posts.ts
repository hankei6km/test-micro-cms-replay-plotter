import fetch from 'node-fetch';
import { ParsedUrlQuery } from 'querystring';
import { GetStaticPropsContext } from 'next';

// getStaticProps 等のビルド時に実行される関数以外からは呼ばないように注意
// (getStaticProps は デプロイされるときに bundle されないはずだが、明記されたところは見たいことないような。。。)

// async にしても大丈夫? index.js では async から呼んでいるが、await はなかった
export async function getSortedPostsData() {
  try {
    const res = await fetch(`${process.env.BLOG_API_URL_BASE}`, {
      method: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    if (res.ok) {
      return ((await res.json()) || []).contents.map(
        ({ id, title, publishedAt }) => {
          return {
            id,
            title,
            date: publishedAt
            // date: new Date(publusedAt),
          };
        }
      );
    } else {
      console.error(`getSortedPostsData error: ${res.statusText}`);
    }
  } catch (err) {
    // TODO: ビルド時のエラーはどう扱うのが正解? 迂闊に err を表示するとシークレットが漏洩する可能性もある.
    console.error(`getSortedPostsData error: ${err.name}`);
  }
  return [];
}

export async function getAllPostIds() {
  try {
    const res = await fetch(`${process.env.BLOG_API_URL_BASE}`, {
      method: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    if (res.ok) {
      return ((await res.json()) || []).contents.map(({ id }) => {
        return {
          params: {
            id
          }
        };
      });
    } else {
      console.error(`getAllPostIds error: ${res.statusText}`);
    }
  } catch (err) {
    // TODO: ビルド時のエラーはどう扱うのが正解? 迂闊に err を表示するとシークレットが漏洩する可能性もある.
    console.error(`getAllPostIds error: ${err.name}`);
  }
  return [];
}

export async function getPostData({
  params,
  preview = false,
  previewData = {}
}: GetStaticPropsContext<ParsedUrlQuery>) {
  try {
    let url = `${process.env.BLOG_API_URL_BASE}/${params.id}`;
    if (preview) {
      // console.log('----preview');
      const q = new URLSearchParams('');
      q.append('draftKey', previewData.draftKey);
      url = `${process.env.BLOG_API_URL_BASE}/${
        previewData.slug
      }?${q.toString()}`;
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    // console.log(res.data.series);
    // Combine the data with the id and contentHtml
    if (res.ok) {
      const data = (await res.json()) || { series: [] };
      return {
        id: data.id,
        contentHtml: data.content,
        //...matterResult.data
        title: data.title,
        date:
          data.publishedAt !== undefined ? data.publishedAt : data.createdAt,
        description: data.description || '',
        mainVisual: data.mainVisual || '',
        mainVisualShow: data.mainVisualShow,
        mainVisualText: data.mainVisualText || '',
        series: data.series.map((e) => {
          return {
            name: e.name,
            data: JSON.parse(e.data)
          };
        })
      };
    } else {
      console.error(`getPostData error: ${res.statusText}`);
    }
  } catch (err) {
    // TODO: ビルド時のエラーはどう扱うのが正解? 迂闊に response を表示するとシークレットが漏洩する可能性もある.
    console.error(`getPostData error: ${err.name}`);
  }
  return {};
}
