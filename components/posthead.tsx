import Head from 'next/head';
import config from '../src/config';

// TODO: https://github.com/garmeeh/next-seo なども

export function ImageUrl(image: string, title: string): string {
  const q = new URLSearchParams('');
  q.append('fm', 'webp');
  if (title) {
    q.append('fit', 'crop');
    q.append('w', '1280');
    q.append('h', '640');
    q.append('txt', title);
    q.append('txt-font', 'sans-serif,bold');
    q.append('txt-size', '104');
    q.append('txt-color', 'ddffffff');
    q.append('txt-align', 'middle,center');
    q.append('txt-pad', '124');
    // q.append('txt-clip', 'end,ellipsis'); // txc-fit=max を使う
    q.append('txt-fit', 'max');
    // q.append('txt-shad', '5');
    q.append('txt-line', '2');
    q.append('txt-line-color', 'dd000000');
  }
  return `${image}?${q.toString()}`;
}

type Props = {
  title?: string;
  description?: string;
  image?: string;
};

export default function PostHead({
  title = config.title,
  description = config.description,
  // image = config.logo
  image //デフォルト以外では  microCMS の画像 API を経由させるので、ここで置き換えない.
}: Props) {
  const imageUrl = image ? ImageUrl(image, title) : ImageUrl(config.logo, '');
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="og:title" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}
