// import { useRouter } from 'next/router';
// import Head from 'next/head';
import ErrorPage from 'next/error';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';
import PostHead, { ImageUrl } from '../../components/posthead';
import Plotter, { Series } from '../../components/plotter';
import utilStyles from '../../styles/utils.module.css';

import { GetStaticProps, GetStaticPaths } from 'next';

export default function Post({
  postData,
  preview
}: {
  postData: {
    // TODO: microCMS の API スキーム用の型定義をまとめる
    title: string;
    date: string;
    contentHtml: string;
    mainVisual: {
      url: string;
    };
    series: Series;
  };
  preview: boolean;
}) {
  // https://github.com/vercel/next.js/blob/b41f9baaa413d5dac29faf107663214c0923c8bd/examples/cms-contentful/pages/posts/%5Bslug%5D.js
  // const router = useRouter();

  // if (!router.isFallback && !postData) {
  if (!postData) {
    // cookie がないときに `An unexpected error has occurred.' となる
    // これが原因かはわからないが
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      head={
        <PostHead
          title={postData.title}
          description={'post_desc'}
          image={postData.mainVisual ? postData.mainVisual.url : undefined}
        />
      }
    >
      <article>
        <h1 className={utilStyles.headingXl}>
          {preview && (
            <a href="/api/blog_exit_preview" className={utilStyles.draftText}>
              {'[DRAFT(click to exit)] '}
            </a>
          )}
          {postData.title}
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        {preview && postData.mainVisual && (
          // ImageUrl をここでも実行するのはちょっと面白くないかも
          <img
            src={ImageUrl(postData.mainVisual.url, postData.title)}
            alt="Card Preview"
          />
        )}
        {(postData.series || []).length > 0 && (
          <Plotter series={postData.series} />
        )}
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const postData = await getPostData(context);
  return {
    props: {
      postData,
      preview: context.preview ? context.preview : null
    }
  };
};