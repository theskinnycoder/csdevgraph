import cookieParser from 'cookie-parser';
import { config } from 'dotenv-safe';
import express, { json } from 'express';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import cors from 'cors';

// Local Imports
import connectDB from './utils/connectDB';
import { __is_prod__ } from './utils/constants';
import user_routes from './routes/user_routes';

// DotENV Config
config({ debug: true });

// Extract the required environment variables
const { PORT, NODE_ENV } = process.env;

// Main Async IIFE to 1st Connect to the DataBase and only then listen for requests
(async () => {
  // Connect to the DataBase
  await connectDB();

  // Initialize the Express Web-App Instance
  const app = express();

  // Express Middlewares
  app.use(json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
  if (!__is_prod__) app.use(morgan('dev'));

  // Forward /api/auth routes to the user_controllers
  app.use('/api/auth/', user_routes);

  // Custom Error-Handlers
  app.use(notFound);
  app.use(errorHandler);

  // Listen for requests
  app.listen(PORT, () =>
    console.log(
      `Server up and running in ${NODE_ENV} mode and is listening for requests at http://localhost:${PORT}`
    )
  );
})();
