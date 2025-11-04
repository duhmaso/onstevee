# Switch to the legacy (original) files. Backups current files to backups/ and copies legacy files into place.
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backupDir = Join-Path $root 'backups'
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

Copy-Item -Path (Join-Path $root 'index.html') -Destination (Join-Path $backupDir 'index.html.bak') -Force
Copy-Item -Path (Join-Path $root 'styles.css') -Destination (Join-Path $backupDir 'styles.css.bak') -Force

Copy-Item -Path (Join-Path $root 'legacy\index.legacy.html') -Destination (Join-Path $root 'index.html') -Force
Copy-Item -Path (Join-Path $root 'legacy\styles.legacy.css') -Destination (Join-Path $root 'styles.css') -Force

Write-Output "Switched to legacy. Backups saved to: $backupDir"
