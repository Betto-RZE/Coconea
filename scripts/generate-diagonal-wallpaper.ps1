param (
    [int]$TileSize = 220,
    [int]$IconSize = 108
)

Add-Type -AssemblyName System.Drawing

$srcFile = Join-Path $PSScriptRoot "..\apps\customer\public\images\coconea-pattern-icon.png"
$dstFile = Join-Path $PSScriptRoot "..\apps\customer\public\images\coconea-wallpaper-diagonal.png"

if (-not (Test-Path $srcFile)) {
    Write-Error "Source file not found: $srcFile"
    exit 1
}

$src = [System.Drawing.Image]::FromFile((Resolve-Path $srcFile).Path)
$bmp = New-Object System.Drawing.Bitmap($TileSize, $TileSize)
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

$quadrant = [int]($TileSize / 2)
$offset = [int](($quadrant - $IconSize) / 2)

# Icon 1: Top-Left quadrant
$g.DrawImage($src, $offset, $offset, $IconSize, $IconSize)

# Icon 2: Bottom-Right quadrant
$g.DrawImage($src, ($quadrant + $offset), ($quadrant + $offset), $IconSize, $IconSize)

$fullDstPath = [System.IO.Path]::GetFullPath($dstFile)
$bmp.Save($fullDstPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Output "Generated diagonal wallpaper: TileSize=${TileSize}x${TileSize}, IconSize=${IconSize}x${IconSize} at $fullDstPath"
