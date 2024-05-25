import e from 'express';
import { app } from './server.js';
import { routerApiV1 } from './routes/router.js';

app.use(e.json());
routerApiV1(app);

app.listen(3000, () => console.log('up in port 3000'));
