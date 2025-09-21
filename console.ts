import repl from 'repl';
import models from './src/models/index';
import { AppDataSource } from './src/data-source';

console.log('Starting REPL...');

let replServer = repl.start({
  prompt: 'app > '
});

const initDb = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database initialized successfully');
    } else {
      console.log('Database already initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

const init= async () => {
  await initDb()

  console.log(models);
  Object.keys(models).forEach(modelName => {
    replServer.context[modelName] = AppDataSource.getRepository(models[modelName]);
  });
  // Add context for working with entities
  replServer.context.console = console;
  replServer.context.global = global;
}

init();