import { spawn } from 'node:child_process'

const processes = [
  {
    name: 'backend',
    command: process.execPath,
    args: ['--env-file=.env', '--experimental-strip-types', 'backend/src/server.ts'],
  },
  {
    name: 'frontend',
    command: process.execPath,
    args: ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
  },
]

const children = processes.map((item) => {
  const child = spawn(item.command, item.args, {
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
  })

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${item.name}] ${chunk}`)
  })

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${item.name}] ${chunk}`)
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${item.name}] saiu com codigo ${code}.`)
      stopAll(code)
    }
  })

  return child
})

console.log('Backend iniciado em http://127.0.0.1:3333.')
console.log('Frontend iniciado em http://127.0.0.1:5173.')
console.log('Use Ctrl+C para parar os servicos.')

function stopAll(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill()
    }
  }

  process.exit(code)
}

process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))
