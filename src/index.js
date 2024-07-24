import { app } from './server.js';
import { routerApiV1 } from './routes/router.js';

const port = process.env.PORT;
app.get('/', (req, res) => {
  res.json({ message: 'home page' });
});
routerApiV1(app);
app.listen(port, () => console.log(`up in port ${port}`));

export default app;
