# Switch to the modern files I created. Backups current files to backups/ and copies modern files into place.
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backupDir = Join-Path $root 'backups'
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

Copy-Item -Path (Join-Path $root 'index.html') -Destination (Join-Path $backupDir 'index.html.bak') -Force
Copy-Item -Path (Join-Path $root 'styles.css') -Destination (Join-Path $backupDir 'styles.css.bak') -Force

Copy-Item -Path (Join-Path $root 'modern\index.modern.html') -Destination (Join-Path $root 'index.html') -Force
Copy-Item -Path (Join-Path $root 'modern\styles.modern.css') -Destination (Join-Path $root 'styles.css') -Force

Write-Output "Switched to modern. Backups saved to: $backupDir"
