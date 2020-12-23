import Head from 'next/head';
import config from '../src/config';

// TODO: https://github.com/garmeeh/next-seo なども

const regExpPlus = /\+/g;
const regExpSlash = /\//g;

export function ImageUrl(image: string, imageText: string): string {
  const q = new URLSearchParams('');
  q.append('fm', 'webp'); // og:image にはよろしくなさそう
  q.append('fit', 'crop');
  q.append('w', '1280');
  q.append('h', '640');
  q.append('blend-color', 'dd97BBCC');
  if (imageText) {
    // https://docs.imgix.com/apis/rendering#base64-variants
    // https://developer.mozilla.org/ja/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    // https://stackoverflow.com/questions/24523532/how-do-i-convert-an-image-to-a-base64-encoded-data-url-in-sails-js-or-generally
    // https://qiita.com/awakia/items/049791daca69120d7035
    // console.log(
    //   Buffer.from(imageText, 'utf-8')
    //     .toString('base64')
    //     .replace(regExpSlash, '_')
    //     .replace(regExpPlus, '-')
    // );
    q.append(
      'txt64',
      Buffer.from(imageText, 'utf-8')
        .toString('base64')
        .replace(regExpSlash, '_')
        .replace(regExpPlus, '-')
    );
    q.append('txt-font', 'sans-serif,bold');
    q.append('txt-size', '152');
    q.append('txt-color', 'ffffffff');
    q.append('txt-align', 'middle,center');
    q.append('txt-pad', '124');
    // q.append('txt-clip', 'end,ellipsis'); // txc-fit=max を使う
    q.append('txt-fit', 'max');
    // q.append('txt-shad', '5');
    q.append('txt-line', '2');
    q.append('txt-line-color', 'ee000000');
  }
  return `${image}?${q.toString()}`;
}

function TwitterImageUrl(image: string, cardTemplate: string): string {
  if (image) {
    const p = cardTemplate ? cardTemplate.split('?', 2)[1] : '';
    return p ? `${image}?${p}` : '';
  }
}

type Props = {
  title?: string;
  description?: string;
  image?: string;
  imageText?: string;
  cardTemplate?: string;
};

export default function PostHead({
  title = config.title,
  description,
  image,
  imageText = '',
  cardTemplate = ''
}: Props) {
  const imageUrl = image
    ? ImageUrl(image, imageText)
    : ImageUrl(config.logo, '');
  const twitterImageUrl = TwitterImageUrl(image, cardTemplate);
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
      <meta
        name="description"
        content={description ? description : config.description}
      />
      <meta property="og:image" content={imageUrl} />
      <meta name="og:title" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      {twitterImageUrl !== '' && (
        <meta property="twitter:image" content={twitterImageUrl} />
      )}
    </Head>
  );
}
