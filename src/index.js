import { app } from './server.js';
import { routerApiV1 } from './routes/router.js';

routerApiV1(app);
const port = process.env.PORT;
app.listen(port, () => console.log(`up in port ${port}`));
