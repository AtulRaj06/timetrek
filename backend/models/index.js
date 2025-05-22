// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Sequelize, DataTypes } from 'sequelize';
// import process from 'process';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';

// import config from '../config/config.js';
// const dbConfig = config[env];

// const db = {};

// let sequelize;
// if (dbConfig.use_env_variable) {
//   sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
// } else {
//   sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
// }

// const files = fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   });

// const initDatabase = async () => {
//   for (const file of files) {
//     const model = (await import(path.join(__dirname, file))).default;
//     if (model) {
//       const modelInstance = model(sequelize, DataTypes);
//       db[modelInstance.name] = modelInstance;
//     }
//   }

//   Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });

//   db.sequelize = sequelize;
//   db.Sequelize = Sequelize;
  
//   return db;
// };

// // Export the initialization function instead of the awaited result
// export default initDatabase;



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

import config from '../config/config.js';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

export { sequelize };
export default sequelize;