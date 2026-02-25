$videosDir = "VIDEOS"
$files = Get-ChildItem "$videosDir\*.mp4", "$videosDir\*.mov" | Where-Object { $_.Length -gt 25MB }

foreach ($file in $files) {
    $outFile = "$videosDir\compressed_$($file.BaseName).mp4"
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    
    # Calculate target bitrate for ~24MB output
    # Get duration first
    $duration = & ffmpeg -i $file.FullName 2>&1 | Select-String "Duration" | ForEach-Object { 
        if ($_ -match "Duration:\s*(\d+):(\d+):(\d+)\.(\d+)") {
            [int]$matches[1]*3600 + [int]$matches[2]*60 + [int]$matches[3] + [int]$matches[4]/100
        }
    }
    
    if (-not $duration -or $duration -eq 0) { $duration = 60 }
    
    # Target 22MB to be safe (in bits)
    $targetBits = 22 * 8 * 1024 * 1024
    $videoBitrate = [math]::Floor($targetBits / $duration)
    $videoBitrateK = [math]::Floor($videoBitrate / 1000)
    
    Write-Host "Compressing $($file.Name) ($sizeMB MB, ${duration}s) -> ${videoBitrateK}k bitrate"
    
    & ffmpeg -i $file.FullName -c:v libx264 -b:v "${videoBitrateK}k" -maxrate "$([math]::Floor($videoBitrateK * 1.5))k" -bufsize "$([math]::Floor($videoBitrateK * 3))k" -preset medium -c:a aac -b:a 128k -movflags +faststart -y $outFile 2>&1 | Out-Null
    
    if (Test-Path $outFile) {
        $newSize = [math]::Round((Get-Item $outFile).Length / 1MB, 2)
        Write-Host "  -> Compressed to $newSize MB"
        
        # Replace original with compressed version
        Remove-Item $file.FullName -Force
        Rename-Item $outFile -NewName $file.Name
    } else {
        Write-Host "  -> FAILED to compress"
    }
}

# Also compress SHOWREEL.mp4 in root if over 25MB
$showreel = Get-Item "SHOWREEL.mp4" -ErrorAction SilentlyContinue
if ($showreel -and $showreel.Length -gt 25MB) {
    $sizeMB = [math]::Round($showreel.Length / 1MB, 2)
    $duration = & ffmpeg -i $showreel.FullName 2>&1 | Select-String "Duration" | ForEach-Object { 
        if ($_ -match "Duration:\s*(\d+):(\d+):(\d+)\.(\d+)") {
            [int]$matches[1]*3600 + [int]$matches[2]*60 + [int]$matches[3] + [int]$matches[4]/100
        }
    }
    if (-not $duration -or $duration -eq 0) { $duration = 60 }
    $targetBits = 22 * 8 * 1024 * 1024
    $videoBitrateK = [math]::Floor(($targetBits / $duration) / 1000)
    
    Write-Host "Compressing SHOWREEL.mp4 ($sizeMB MB) -> ${videoBitrateK}k bitrate"
    & ffmpeg -i $showreel.FullName -c:v libx264 -b:v "${videoBitrateK}k" -maxrate "$([math]::Floor($videoBitrateK * 1.5))k" -bufsize "$([math]::Floor($videoBitrateK * 3))k" -preset medium -c:a aac -b:a 128k -movflags +faststart -y "SHOWREEL_compressed.mp4" 2>&1 | Out-Null
    
    if (Test-Path "SHOWREEL_compressed.mp4") {
        $newSize = [math]::Round((Get-Item "SHOWREEL_compressed.mp4").Length / 1MB, 2)
        Write-Host "  -> Compressed to $newSize MB"
        Remove-Item "SHOWREEL.mp4" -Force
        Rename-Item "SHOWREEL_compressed.mp4" -NewName "SHOWREEL.mp4"
    }
}
