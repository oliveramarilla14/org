import { app } from './server.js';
import { routerApiV1 } from './routes/router.js';

routerApiV1(app);
app.listen(3000, () => console.log('up in port 3000'));
