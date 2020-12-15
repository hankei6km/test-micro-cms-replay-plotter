import cheerio from 'cheerio';
import hljs from 'highlight.js';
// https://microcms.io/blog/syntax-highlighting-on-server-side

export function rewriteImage(body: string, imageTempl: string): string {
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

    const $ = cheerio.load(body);
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
    return $.html();
  }
  return body;
}

export function rewriteCode(body: string): string {
  const $ = cheerio.load(body);
  $('pre code').each((_idx, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass('hljs');
  });
  return $.html();
}
