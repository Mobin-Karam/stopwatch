import autocannon from 'autocannon';

const url = process.env.LOAD_TEST_TARGET || 'http://localhost:3000/api/health';
const connections = Number(process.env.LOAD_TEST_CONNECTIONS || 10);
const duration = Number(process.env.LOAD_TEST_DURATION || 30);

console.log(
  `Running load test: ${url} with ${connections} connections for ${duration}s`,
);

autocannon(
  {
    url,
    connections,
    duration,
  },
  (err, res) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(autocannon.printResult(res));
  },
);
