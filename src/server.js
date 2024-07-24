import e from 'express';
import cors from 'cors';

export const app = e();

app.use(e.json());
app.use(cors());

app.use('/files', e.static('public/uploads'));
