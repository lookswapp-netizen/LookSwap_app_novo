import express from 'express';
import cors from 'cors';
import generateLookRoute from './routes/generateLook.ts';

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use('/generate-look', generateLookRoute);

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
