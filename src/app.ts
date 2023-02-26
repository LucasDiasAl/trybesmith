import express from 'express';
import 'express-async-errors';
// import errorMiddleware from './middlewares/Error';
import productRouter from './routes';

const app = express();

app.use(express.json());

// app.use(errorMiddleware);

app.use('/products', productRouter);

export default app;
