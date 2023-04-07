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
  // eslint-disable-next-line no-undef, no-unused-vars
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
