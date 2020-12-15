import fetch from 'node-fetch';
import { ParsedUrlQuery } from 'querystring';
import { GetStaticPropsContext } from 'next';
import { rewriteImage, rewriteCode, rewrite } from './rewrite';

// getStaticProps 等のビルド時に実行される関数以外からは呼ばないように注意
// (getStaticProps は デプロイされるときに bundle されないはずだが、明記されたところは見たいことないような。。。)

function getFieldsQueryParams(fileds: string[]): string {
  const q = new URLSearchParams('');
  q.append('fields', fileds.join(','));
  return q.toString();
}
// API で取得する fields の params.
// 文字列の配列は型の拘束から外れるので、スキーマの型定義などをうまく利用する方法を検討。
// ie. sortedPostsDataFields は  Home component(index.tsx) の props(allPostsData) に関連する
//         -> これを API のスキーマとすり合わせて fields もうまいこと生成できないか
const sortedPostsDataFields = getFieldsQueryParams([
  'id',
  'title',
  'publishedAt'
]);
const allPostIdsFields = getFieldsQueryParams(['id']);
const postDataFields = getFieldsQueryParams([
  'id',
  'content',
  'title',
  'publishedAt',
  'createdAt',
  'description',
  'mainVisual',
  'mainVisualShow',
  'mainVisualText',
  'series',
  'cardTemplate',
  'imageTemplate'
]);

// async にしても大丈夫? index.js では async から呼んでいるが、await はなかった
export async function getSortedPostsData() {
  try {
    const res = await fetch(
      `${process.env.BLOG_API_URL_BASE}?${sortedPostsDataFields}`,
      {
        method: 'GET',
        headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
      }
    );
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
    const res = await fetch(
      `${process.env.BLOG_API_URL_BASE}?${allPostIdsFields}`,
      {
        method: 'GET',
        headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
      }
    );
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
    let url = `${process.env.BLOG_API_URL_BASE}/${params.id}?${postDataFields}`;
    if (preview) {
      // console.log('----preview');
      const previewDataFields = new URLSearchParams(postDataFields);
      previewDataFields.append('draftKey', previewData.draftKey);
      url = `${process.env.BLOG_API_URL_BASE}/${
        previewData.slug
      }?${previewDataFields.toString()}`;
    }
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    // console.log(res.data.series);
    // Combine the data with the id and contentHtml
    if (res.ok) {
      const data = (await res.json()) || { series: [] };
      const contentHtml = rewrite(data.content)
        .use(rewriteCode())
        .use(rewriteImage(data.imageTemplate))
        .run();
      return {
        id: data.id,
        contentHtml: contentHtml,
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
