import e from 'express';
import cors from 'cors';

export const app = e();

app.use(e.json());
app.use(cors());
