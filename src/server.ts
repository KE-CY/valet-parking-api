import app from './app';
import logger from './utils/logger';

// Retrieve the port from the environment variable
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
