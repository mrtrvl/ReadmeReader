const { Octokit } = require('@octokit/rest');
// eslint-disable-next-line import/no-extraneous-dependencies
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

const {
  githubToken, repoOwner, repoName, pathToReadme,
} = require('../config');

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
    const filteredCommits = commits.filter((commit) => (commit.commit.author.name !== 'mrtrvl') && commit.commit.author.name !== 'Martti Raavel');
    const sortedCommits = filteredCommits.sort(
      (a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date),
    );
    return {
      branch: branch.name,
      commits: sortedCommits,
    };
  });

  return Promise.all(commitsPromises);
}

module.exports = {
  getCommits,
  getReadmes,
};
