import { MongoMemoryServer } from 'mongodb-memory-server';

module.exports = async () => {
  const mongod = await MongoMemoryServer.create({
    binary: { version: '5.0.15' },
  });
  process.env.MONGO_URI = mongod.getUri('time-e2e');
  (global as any).__MONGOD__ = mongod;
};
