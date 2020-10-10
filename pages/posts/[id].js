// import { useRouter } from 'next/router';
import Head from 'next/head';
import ErrorPage from 'next/error';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Date from '../../components/date';
import Plotter from '../../components/plotter';
import utilStyles from '../../styles/utils.module.css';

export default function Post({ postData, preview }) {
  // https://github.com/vercel/next.js/blob/b41f9baaa413d5dac29faf107663214c0923c8bd/examples/cms-contentful/pages/posts/%5Bslug%5D.js
  // const router = useRouter();

  // if (!router.isFallback && !postData) {
  if (!postData) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>
          {preview && '[DRAFT]'}
          {postData.title}
        </h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        {(postData.series || []).length > 0 && (
          <Plotter series={postData.series} />
        )}
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps(context) {
  const postData = await getPostData(context);
  return {
    props: {
      postData,
      preview: context.preview
    }
  };
}
