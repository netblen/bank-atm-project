const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const root = __dirname;
const isWindows = process.platform === 'win32';
const dotnetCommand = isWindows ? 'dotnet.exe' : 'dotnet';
const backendDir = path.join(root, 'atm-backend');
const backendExe = path.join(backendDir, 'bin', 'Debug', 'net8.0', isWindows ? 'atm-backend.exe' : 'atm-backend');
const backendCert = path.join(backendDir, 'aspnet-devcert.pfx');

function createBackendTask(useBuiltBackend) {
  const backendEnv = {
    ...process.env,
  };

  if (useBuiltBackend) {
    backendEnv.ASPNETCORE_ENVIRONMENT = backendEnv.ASPNETCORE_ENVIRONMENT || 'Development';
    backendEnv.ASPNETCORE_URLS = backendEnv.ASPNETCORE_URLS || 'https://localhost:7243;http://localhost:5114';

    if (fs.existsSync(backendCert)) {
      backendEnv.ASPNETCORE_Kestrel__Certificates__Default__Path = backendCert;
      backendEnv.ASPNETCORE_Kestrel__Certificates__Default__Password = 'development';
    }
  }

  return {
    name: 'backend',
    command: useBuiltBackend ? backendExe : dotnetCommand,
    args: useBuiltBackend ? [] : ['run', '--launch-profile', 'https'],
    cwd: backendDir,
    env: backendEnv,
    useBuiltBackend,
  };
}

const processes = [
  createBackendTask(process.env.BACKEND_MODE === 'built' && fs.existsSync(backendExe)),
  {
    name: 'frontend',
    command: process.execPath,
    args: [path.join(root, 'node_modules', 'react-scripts', 'scripts', 'start.js')],
    cwd: root,
    env: {
      ...process.env,
      BROWSER: 'none',
    },
  },
];

const children = [];
let shuttingDown = false;

function prefixStream(stream, name, write) {
  const reader = readline.createInterface({ input: stream });
  reader.on('line', (line) => {
    write(`[${name}] ${line}\n`);
  });
}

function stopAll(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  children.forEach((child) => {
    if (!child.killed) {
      child.kill(isWindows ? undefined : 'SIGTERM');
    }
  });

  setTimeout(() => process.exit(code), 250);
}

function startTask(task) {
  const child = spawn(task.command, task.args, {
    cwd: task.cwd,
    env: task.env,
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  children.push(child);
  console.log(`[dev] started ${task.name}: ${task.command} ${task.args.join(' ')}`);

  prefixStream(child.stdout, task.name, process.stdout.write.bind(process.stdout));
  prefixStream(child.stderr, task.name, process.stderr.write.bind(process.stderr));

  child.on('error', (error) => {
    console.error(`[${task.name}] ${error.message}`);
    stopAll(1);
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      if (task.name === 'backend' && !task.useBuiltBackend && code !== 0 && fs.existsSync(backendExe)) {
        console.log('[dev] backend dotnet run failed; falling back to the last built backend executable');
        startTask(createBackendTask(true));
        return;
      }

      const reason = signal || `exit code ${code}`;
      console.log(`[dev] ${task.name} stopped with ${reason}`);
      stopAll(code || 0);
    }
  });
}

processes.forEach(startTask);

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
