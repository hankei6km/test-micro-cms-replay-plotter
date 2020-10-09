import fs from 'fs';
import path from 'path';
import axios from 'axios';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

// getStaticProps 等のビルド時に実行される関数以外からは呼ばないように注意
// (getStaticProps は デプロイされるときに bundle されないはずだが、明記されたところは見たいことないような。。。)

// async にしても大丈夫? index.js では async から呼んでいるが、await はなかった
export async function getSortedPostsData() {
  try {
    const res = await axios(`${process.env.BLOG_API_URL_BASE}`, {
      methods: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    return res.data.contents.map(({ id, title, publishedAt }) => {
      return {
        id,
        title,
        date: publishedAt
        // date: new Date(publusedAt),
      };
    });
  } catch (err) {
    console.log(err);
  }
  return [];
}

export async function getAllPostIds() {
  try {
    const res = await axios(`${process.env.BLOG_API_URL_BASE}`, {
      methods: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    return res.data.contents.map(({ id, title, publishedAt }) => {
      return {
        params: {
          id
        }
      };
    });
  } catch (err) {
    console.log(err);
  }
  return [];
}

export async function getPostData(id) {
  try {
    const res = await axios(`${process.env.BLOG_API_URL_BASE}/${id}`, {
      methods: 'GET',
      headers: { 'X-API-KEY': process.env.BLOG_API_KEY }
    });
    // Combine the data with the id and contentHtml
    return {
      id: res.data.id,
      contentHtml: res.data.content,
      //...matterResult.data
      title: res.data.title,
      date: res.data.publishedAt
    };
  } catch (err) {
    console.log(err);
  }
  return {};
}
