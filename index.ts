import express from 'express';
import cors from 'cors';
import UserRoutes from './src/api/routes/users';
import RoleRoutes from './src/api/routes/roles';
import QuestionRoutes from './src/api/routes/questions';
import PollRoutes from './src/api/routes/polls';
import ResponseRoutes from './src/api/routes/responses';
import OptionRoutes from './src/api/routes/options';
import AuthRoutes from './src/api/routes/auth';
import NotificationRoutes from './src/api/routes/notifications';
import PushRoutes from './src/api/routes/push';

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/roles', RoleRoutes);
app.use('/api/questions', QuestionRoutes);
app.use('/api/polls', PollRoutes);
app.use('/api/responses', ResponseRoutes);
app.use('/api/options', OptionRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api/push', PushRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});