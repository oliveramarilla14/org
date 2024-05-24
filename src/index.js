import { app } from './server.js';
import router from './routes/router.js';

app.use('/api', router);
app.listen(3000, () => console.log('up in port 3000'));
