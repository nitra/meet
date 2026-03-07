import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { handleConnectionDetails } from './routes/connection-details.js';
import { handleRecordStart } from './routes/record-start.js';
import { handleRecordStop } from './routes/record-stop.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/api/connection-details', handleConnectionDetails);
app.get('/api/record/start', handleRecordStart);
app.get('/api/record/stop', handleRecordStop);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
