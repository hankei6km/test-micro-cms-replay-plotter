import { ReactNode } from 'react';
import Head from 'next/head';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import PostHead from './posthead';

const name = 'hankei6km';
export const siteTitle = 'Replay Plotter(test)';
const description = 'microCMS を利用してみるテストのブログ';

export default function Layout({
  children,
  home,
  head = <PostHead />
}: {
  children: ReactNode;
  home?: boolean;
  head?: ReactNode;
}) {
  return (
    <div className={styles.container}>
      {head}
      <header className={styles.header}>
        {home ? (
          <>
            <img
              src="/images/micro_cms_profile.png"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
            <p>
              <a href="opensource_licenses.txt">Open Source Licenses</a>
            </p>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <img
                  src="/images/micro_cms_profile.png"
                  className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}
