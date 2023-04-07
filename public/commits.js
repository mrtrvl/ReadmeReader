/* eslint-disable no-param-reassign */
document.querySelectorAll('.commit-group-header').forEach((header) => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });
});

document.getElementById('revealAllCommits').addEventListener('click', () => {
  document.querySelectorAll('.commit-group-content').forEach((content) => {
    content.style.display = 'block';
  });
});

document.getElementById('hideAllCommits').addEventListener('click', () => {
  document.querySelectorAll('.commit-group-content').forEach((content) => {
    content.style.display = 'none';
  });
});

const getCommitBadgeColor = (commitCount, averageCommitCount) => {
  const threshold = averageCommitCount * 0.1; // 10% threshold
  if (commitCount > averageCommitCount + threshold) {
    return 'green';
  } if (commitCount < averageCommitCount - threshold) {
    return 'yellow';
  }
  return 'lightskyblue';
};

const setBadgeStyle = (badge, commitCount) => {
  const digits = commitCount.toString().length;
  const baseSize = 24;

  if (digits === 1) {
    badge.style.width = `${baseSize}px`;
    badge.style.height = `${baseSize}px`;
    badge.style.lineHeight = `${baseSize}px`;
    badge.style.fontSize = '12px';
  } else if (digits === 2) {
    badge.style.width = `${baseSize + 8}px`;
    badge.style.height = `${baseSize}px`;
    badge.style.lineHeight = `${baseSize}px`;
    badge.style.fontSize = '12px';
  } else {
    badge.style.width = `${baseSize + 16}px`;
    badge.style.height = `${baseSize}px`;
    badge.style.lineHeight = `${baseSize}px`;
    badge.style.fontSize = '10px';
  }
};

const commitGroupsElement = document.getElementById('commitGroups');
if (commitGroupsElement) {
  const averageCommitCount = parseFloat(commitGroupsElement.dataset.averageCommitCount);
  document.querySelectorAll('.commit-count').forEach((badge) => {
    const commitCount = parseInt(badge.dataset.commitCount, 10);
    badge.style.backgroundColor = getCommitBadgeColor(commitCount, averageCommitCount);
    setBadgeStyle(badge, commitCount);
  });
}
