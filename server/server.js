import 'dotenv/config';
import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`[server] running on port ${config.port} (${config.nodeEnv})`);
    });
  })
  .catch((err) => {
    console.error('[db] Connection failed:', err.message);
    process.exit(1);
  });
