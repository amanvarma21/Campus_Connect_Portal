const { startServer } = require("./app");

startServer().catch((error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});