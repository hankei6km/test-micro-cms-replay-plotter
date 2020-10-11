import fetch from 'node-fetch';
import { NextApiRequest, NextApiResponse } from 'next';

// https://microcms.io/blog/nextjs-preview-mode

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !process.env.BLOG_PREVIEW_SECRET ||
    process.env.BLOG_PREVIEW_SECRET !== req.query.previewSecret ||
    !req.query.slug
  ) {
    return res.status(404).end();
  }
  try {
    const q = new URLSearchParams('');
    q.append('fields', 'id');
    q.append('draftKey', req.query.draftKey as string);
    const fres = await fetch(
      `${process.env.BLOG_API_URL_BASE}/${req.query.slug}?${q.toString()}`,
      {
        method: 'GET',
        headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
      }
    );
    if (fres.ok) {
      const content = await fres.json();
      res.setPreviewData({
        slug: content.id,
        draftKey: req.query.draftKey
      });
      res.writeHead(307, { Location: `/posts/${content.id}` });
      return res.end('Preview mode enabled');
    } else {
      return res.status(401).json({ message: 'Invalid slug' });
    }
  } catch (err) {
    return res.status(401).json({ message: res.statusText });
  }
};
