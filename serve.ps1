# Simple HTTP Server for Fanzine Digital
# Usage: Right-click > "Run with PowerShell" or execute: powershell -ExecutionPolicy Bypass -File serve.ps1
# Then open http://localhost:8080

$port = 8080
$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

$mimeTypes = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.gif'  = 'image/gif'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
  '.webp' = 'image/webp'
  '.woff' = 'font/woff'
  '.woff2'= 'font/woff2'
  '.pdf'  = 'application/pdf'
}

try {
  $listener.Start()
  Write-Host ""
  Write-Host "  Fanzine Digital Server" -ForegroundColor Green
  Write-Host "  ======================" -ForegroundColor DarkGreen
  Write-Host "  Serving from: $root" -ForegroundColor DarkGray
  Write-Host ""
  Write-Host "  Open in browser: " -NoNewline
  Write-Host "http://localhost:$port" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "  Press Ctrl+C to stop" -ForegroundColor DarkGray
  Write-Host ""

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath
    if ($urlPath -eq '/') { $urlPath = '/index.html' }

    $filePath = Join-Path $root ($urlPath -replace '/', '\')

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

      $response.ContentType = $contentType
      $response.StatusCode = 200

      # CORS headers
      $response.Headers.Add('Access-Control-Allow-Origin', '*')
      # Cache headers for images
      if ($ext -match '\.(png|jpg|jpeg|gif|webp|svg)$') {
        $response.Headers.Add('Cache-Control', 'public, max-age=3600')
      }

      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)

      $status = "200"
      $color = "Green"
    } else {
      $response.StatusCode = 404
      $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $response.ContentType = 'text/plain'
      $response.ContentLength64 = $body.Length
      $response.OutputStream.Write($body, 0, $body.Length)

      $status = "404"
      $color = "Red"
    }

    $response.Close()
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
    Write-Host "$status " -NoNewline -ForegroundColor $color
    Write-Host $request.Url.LocalPath -ForegroundColor Gray
  }
} catch {
  Write-Host "Error: $_" -ForegroundColor Red
} finally {
  $listener.Stop()
  Write-Host "`n  Server stopped." -ForegroundColor Yellow
}
