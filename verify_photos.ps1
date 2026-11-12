$text = [System.IO.File]::ReadAllText('C:\Users\Name\.gemini\antigravity\scratch\adoptie-animale\js\data.js', [System.Text.Encoding]::UTF8)
$jsonStr = $text.Substring($text.IndexOf('['))
$jsonStr = $jsonStr.Substring(0, $jsonStr.LastIndexOf(']') + 1)
$pets = $jsonStr | ConvertFrom-Json

Write-Host "Total pets: $($pets.Count)"
$images = @($pets | ForEach-Object { $_.image })
$uniqueImages = @($images | Select-Object -Unique)
Write-Host "Total unique images: $($uniqueImages.Count)"

$dupes = $images | Group-Object | Where-Object { $_.Count -gt 1 }
if ($dupes) {
    Write-Host "DUPLICATES FOUND:"
    $dupes | ForEach-Object { Write-Host "$($_.Name) -> $($_.Count) times" }
} else {
    Write-Host "SUCCESS: Zero duplicate images! Every single animal has its own unique photo!"
}
