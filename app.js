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
app.use(express.static(path.join(__dirname, 'public')));

const octokit = new Octokit({
  auth: githubToken,
});

let readmesCache = null;
let cacheTimestamp = null;
const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

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

async function listCommits(branchName) {
  try {
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner: repoOwner,
      repo: repoName,
      sha: branchName,
    });
    return commits;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching commits for branch ${branchName}:`, error);
    throw error;
  }
}

const getReadmes = async () => {
  const readmes = [];
  const branches = await getBranches();
  // eslint-disable-next-line no-restricted-syntax
  for (const branch of branches) {
  // eslint-disable-next-line no-await-in-loop
    const readme = await getReadmeContent(branch.name);
    readmes.push(readme);
  }
  return readmes;
};

async function getCommits() {
  const branches = await getBranches();
  const commitsPromises = branches.map(async (branch) => {
    const commits = await listCommits(branch.name);
    return {
      branch: branch.name,
      commits,
    };
  });

  return Promise.all(commitsPromises);
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/readmes', async (req, res) => {
  const now = Date.now();

  if (readmesCache && cacheTimestamp && now - cacheTimestamp < cacheDuration) {
    res.render('readmes', { readmes: readmesCache });
  } else {
    try {
      const readmes = await getReadmes();
      readmesCache = readmes;
      cacheTimestamp = now;
      res.render('readmes', { readmes });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching readmes:', error);
      res.status(500).send('An error occurred while fetching readmes.');
    }
  }
});

app.get('/commits', async (req, res) => {
  try {
    const commits = await getCommits();
    res.render('commits', { commits });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching commits:', error);
    res.status(500).send('An error occurred while fetching commits.');
  }
});

app.get('/statistics', async (req, res) => {
  res.render('statistics');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port: ${port}`);
});
