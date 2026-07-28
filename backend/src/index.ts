/// <reference path="./global.d.ts" />
import 'dotenv/config';
import { createApp } from './app';

const app = createApp();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`Arcana Backend running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
});
