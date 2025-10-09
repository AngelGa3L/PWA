import  express  from 'express';
import UserRoutes from './src/api/routes/users';
import RoleRoutes  from './src/api/routes/roles';
import QuestionRoutes  from './src/api/routes/questions';
import PollRoutes  from './src/api/routes/polls';
import ResponseRoutes  from './src/api/routes/responses';
import OptionRoutes  from './src/api/routes/options';
const app = express()
const port = 3000

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