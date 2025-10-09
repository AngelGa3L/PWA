const express = require('express')
const app = express()
const port = 3000
const UserRoutes = require('./src/api/routes/users');
const RoleRoutes = require('./src/api/routes/roles');
const QuestionRoutes = require('./src/api/routes/questions');
const PollRoutes = require('./src/api/routes/polls');
const ResponseRoutes = require('./src/api/routes/responses');
const OptionRoutes = require('./src/api/routes/options');


app.use(express.json());
app.use('/api/users', UserRoutes);
app.use('/api/roles', RoleRoutes);
app.use('/api/questions', QuestionRoutes);
app.use('/api/polls', PollRoutes);
app.use('/api/responses', ResponseRoutes);
app.use('/api/options', OptionRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})