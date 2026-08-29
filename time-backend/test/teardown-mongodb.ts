module.exports = async () => {
  const mongod = (global as any).__MONGOD__;
  if (mongod) {
    await mongod.stop();
  }
};
