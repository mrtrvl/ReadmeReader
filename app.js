const express = require('express');
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
const ejs = require('ejs');
const path = require('path');

const commitsRoute = require('./routes/commits');
const readmesRoute = require('./routes/readmes');
const statisticsRoute = require('./routes/statistics');
const issuesRoute = require('./routes/issues');

const {
  port,
} = require('./config');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(commitsRoute);
app.use(readmesRoute);
app.use(statisticsRoute);
app.use(issuesRoute);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port: ${port}`);
});
