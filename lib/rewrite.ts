import cheerio from 'cheerio';
import hljs from 'highlight.js';
// https://microcms.io/blog/syntax-highlighting-on-server-side

type rewritePlug = ($: cheerio.Root) => Error;

export function rewriteImage(imageTempl: string): rewritePlug {
  return ($) => {
    if (imageTempl) {
      // parameters の取り出し
      const sourcesParams = [];
      let imgParams = '';
      const $imageTempl = cheerio.load(imageTempl);
      $imageTempl('picture source').each((_idx, elm) => {
        sourcesParams.push(
          $imageTempl(elm)
            .attr('srcset')
            .split(', ')
            .map((v) => v.split('?', 2)[1])
        );
      });
      imgParams = $imageTempl('picture img').attr('src').split('?', 2)[1];

      $('img').each((_idx, elm) => {
        const u = $(elm).attr('src').split('?', 1)[0];
        const alt = $(elm).attr('alt');
        const $imageTempl = cheerio.load(imageTempl);
        $imageTempl('picture source').each((idx, elm) => {
          $imageTempl(elm).attr(
            'srcset',
            sourcesParams[idx].map((v) => `${u}?${v}`).join(',')
          );
        });
        $imageTempl('picture img').attr('src', `${u}?${imgParams}`);
        $imageTempl('picture img').attr('alt', alt);
        $(elm).replaceWith($imageTempl('body').html());
      });
    }
    return null;
  };
}

export function rewriteCode(): rewritePlug {
  return ($) => {
    $('pre code').each((_idx, elm) => {
      const result = hljs.highlightAuto($(elm).text());
      $(elm).html(result.value);
      $(elm).addClass('hljs');
    });
    return null;
  };
}

type chain = {
  use: (p: rewritePlug) => chain;
  run: () => void;
};

export function rewrite(body: string): chain {
  const $ = cheerio.load(body);

  const plugs: rewritePlug[] = [];
  const runFunc = () => {
    plugs.forEach((v) => v($));
    return $.html();
  };
  const useFunc = (p: rewritePlug) => {
    plugs.push(p);
    return {
      use: useFunc,
      run: runFunc
    };
  };
  return {
    use: useFunc,
    run: runFunc
  };
}
