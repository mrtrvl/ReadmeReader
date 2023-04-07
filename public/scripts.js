/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const toggleContent = (element) => {
  const arrow = element.querySelector('.arrow');
  const content = element.nextElementSibling;
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
  arrow.classList.toggle('arrow-closed');
  arrow.classList.toggle('arrow-open');
};

const revealAll = () => {
  const headers = document.querySelectorAll('h2');
  headers.forEach((header) => {
    const arrow = header.querySelector('.arrow');
    const content = header.nextElementSibling;

    if (content.style.display === 'none') {
      content.style.display = 'block';
      arrow.classList.remove('arrow-closed');
      arrow.classList.add('arrow-open');
    }
  });
};

const hideAll = () => {
  const headers = document.querySelectorAll('h2');
  headers.forEach((header) => {
    const arrow = header.querySelector('.arrow');
    const content = header.nextElementSibling;

    if (content.style.display === 'block') {
      content.style.display = 'none';
      arrow.classList.remove('arrow-open');
      arrow.classList.add('arrow-closed');
    }
  });
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateCommitFrequencyChartData = (commitGroups) => {
  const dates = {};

  commitGroups.forEach((commitGroup) => {
    commitGroup.commits.forEach((commit) => {
      const date = new Date(commit.commit.author.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      if (!dates[key]) {
        dates[key] = {};
      }

      if (dates[key][commitGroup.branch]) {
        dates[key][commitGroup.branch] += 1;
      } else {
        dates[key][commitGroup.branch] = 1;
      }
    });
  });

  const sortedKeys = Object.keys(dates).sort();
  const labels = sortedKeys;
  const dataSets = commitGroups.map((commitGroup) => {
    const data = sortedKeys.map((key) => (dates[key][commitGroup.branch] || 0));
    return {
      label: commitGroup.branch,
      data,
      fill: false,
      borderColor: getRandomColor(),
    };
  });

  return { labels, dataSets };
};

if (document.getElementById('commitFrequencyChart')) {
  const commitsJson = document.getElementById('commitFrequencyChartData').textContent;
  const commitGroups = JSON.parse(commitsJson);
  const { labels, dataSets } = generateCommitFrequencyChartData(commitGroups);

  const ctx = document.getElementById('commitFrequencyChart').getContext('2d');
  // eslint-disable-next-line no-undef
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: dataSets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

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

const navLinks = document.querySelectorAll('[data-loading]');
const loadingIndicator = document.getElementById('loadingIndicator');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetUrl = event.target.href;

    if (targetUrl) {
      loadingIndicator.style.display = 'block';
      window.location.href = targetUrl;
    }
  });
});
