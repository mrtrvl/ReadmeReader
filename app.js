const { Octokit } = require('@octokit/rest');
const express = require ('express');

const { githubToken, repoOwner, repoName, pathToReadme, port } = require('./config');

const app = express();

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
    console.log(`README content for branch ${branch}:\n${content}`);
  } catch (error) {
    console.error(`Error fetching README for branch ${branch}: ${error.message}`);
  }
};

async function main() {
  const branches = await getBranches();
  for (const branch of branches) {
    await getReadmeContent(branch.name);
  }
}

app.get('/readmes', (req, res) => {
  main();
  res.send('Fetching data');
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});