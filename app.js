const { Octokit } = require('@octokit/rest');
const express = require('express');
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
const ejs = require('ejs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

const {
  githubToken, repoOwner, repoName, pathToReadme, port,
} = require('./config');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const octokit = new Octokit({
  auth: githubToken,
});

const getBranches = async () => {
  const branches = await octokit.rest.repos.listBranches({
    owner: repoOwner,
    repo: repoName,
  });
  return branches.data;
};

const getReadmeContent = async (branch) => {
  try {
    const readme = await octokit.rest.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: `${branch}${pathToReadme}`,
      ref: branch,
    });
    const content = Buffer.from(readme.data.content, 'base64').toString('utf-8');
    // console.log(`README content for branch ${branch}:\n${content}`);
    return {
      branch,
      content: md.render(content),
    };
  } catch (error) {
    // console.error(`Error fetching README for branch ${branch}: ${error.message}`);
    return {
      branch,
      content: error.message,
    };
  }
};

app.get('/', (req, res) => {
  res.render('index', { message: 'Hello from EJS!' });
});

async function main() {
  const readmes = [];
  const branches = await getBranches();
  // eslint-disable-next-line no-restricted-syntax
  for (const branch of branches) {
  // eslint-disable-next-line no-await-in-loop
    const readme = await getReadmeContent(branch.name);
    readmes.push(readme);
  }
  return readmes;
}

app.get('/readmes', async (req, res) => {
  const readmes = await main();
  res.render('readmes', { readmes });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port: ${port}`);
});
