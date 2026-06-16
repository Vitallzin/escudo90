$ErrorActionPreference = "Stop"

function Stop-ProcessOnPort {
  param([int]$Port)

  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

  foreach ($connection in $connections) {
    $processId = $connection.OwningProcess

    if ($processId -and $processId -ne $PID) {
      Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
  }
}

Stop-ProcessOnPort -Port 3333
Stop-ProcessOnPort -Port 5173

$backend = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev:backend") -WorkingDirectory $PSScriptRoot\.. -PassThru
$frontend = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "dev:frontend") -WorkingDirectory $PSScriptRoot\.. -PassThru

Write-Host "Backend iniciado em http://127.0.0.1:3333."
Write-Host "Frontend iniciado em http://127.0.0.1:5173."
Write-Host "Feche esta janela com Ctrl+C quando quiser parar."

try {
  while (-not $backend.HasExited -and -not $frontend.HasExited) {
    Start-Sleep -Seconds 1
  }
}
finally {
  if (-not $backend.HasExited) {
    Stop-Process -Id $backend.Id -Force
  }

  if (-not $frontend.HasExited) {
    Stop-Process -Id $frontend.Id -Force
  }
}
