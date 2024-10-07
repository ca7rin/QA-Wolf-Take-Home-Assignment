// tests/hackerNews.test.js
const { test, expect } = require('@playwright/test');

test('fetch and sort Hacker News articles', async ({ page }) => {
  await page.goto("https://news.ycombinator.com/newest");

  // Get the first 5 articles
  const articles = await page.$$eval('.athing', rows => {
    return rows.slice(0, 5).map(row => {
      const title = row.querySelector('.titleline a')?.innerText || '';
      const age = row.nextElementSibling.querySelector('.age')?.innerText || '';
      return { title, age };
    });
  });

  console.log("First 5 articles:", articles);

  // Check that the articles array is of expected length
  expect(articles.length).toBe(5);

  // Check that titles are not empty
  articles.forEach(article => {
    expect(article.title).not.toBe('');
  });

  // Additional checks could include the age format
  articles.forEach(article => {
    expect(article.age).toMatch(/^\d+ minutes ago$/);
  });

  // Optionally validate the sorting order based on age
  // (This requires extracting actual timestamps, which is more complex)
});
