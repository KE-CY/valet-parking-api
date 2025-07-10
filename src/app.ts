import express from 'express';
import bodyParser from 'body-parser';
import healthRoutes from './routes/healthRoute';

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '1tb' }));
app.use(bodyParser.json({ limit: '1tb' }));

// Routes
app.use('/health', healthRoutes);

export default app;