const { spawn } = require('child_process');
const path = require('path');

const server = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'inherit'],
});

let testStarted = false;

server.stdout.on('data', (data) => {
  process.stdout.write(data);
  if (!testStarted && data.toString().includes('Server is running')) {
    testStarted = true;
    const tester = spawn('node', ['test-server.js'], {
      cwd: __dirname,
      stdio: 'inherit',
    });

    tester.on('close', (code) => {
      server.kill();
      process.exit(code);
    });
  }
});

// Fallback timeout in case stdout message was already flushed
setTimeout(() => {
  if (!testStarted) {
    testStarted = true;
    const tester = spawn('node', ['test-server.js'], {
      cwd: __dirname,
      stdio: 'inherit',
    });

    tester.on('close', (code) => {
      server.kill();
      process.exit(code);
    });
  }
}, 3000);
