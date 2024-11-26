import express, { Response } from 'express';
import cors from 'cors';
import { PATH } from './common/paths';
import { blogRouter } from './routers/blogRouter';

export const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (_, res: Response) => {
  res.status(200).json({ version: '1.0.0' });
});

app.use(PATH.BLOGS, blogRouter);