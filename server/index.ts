import { createApp } from './app';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[Tathastu Insights Backend] Running on http://localhost:${PORT}`);
  console.log(`[Tathastu Insights Backend] Health check at http://localhost:${PORT}/api/system/health`);
});
