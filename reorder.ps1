$content = Get-Content 'index.html' -Raw
$navOld = '        <li><a href="#hero">Beranda</a></li>
        <li><a href="#gallery">Galeri</a></li>
        <li><a href="#couple">Mempelai</a></li>
        <li><a href="#event">Acara</a></li>
        <li><a href="#rsvp">Kehadiran</a></li>'

$navNew = '        <li><a href="#hero">Beranda</a></li>
        <li><a href="#couple">Mempelai</a></li>
        <li><a href="#lovestory">Kisah Kami</a></li>
        <li><a href="#gallery">Galeri</a></li>
        <li><a href="#event">Acara</a></li>
        <li><a href="#rsvp">Kehadiran</a></li>'

# Replace nav menu (normalize line endings just in case)
$content = $content -replace [regex]::Escape($navOld -replace "`r`n","`n"), ($navNew -replace "`r`n","`n")

$pattern = '(?s)([ \t]*<!-- Gallery Section \(3x3 Grid\) -->.*?)(?=[ \t]*<!-- Couple Section -->)'

if ($content -match $pattern) {
    $galleryBlock = $matches[1]
    
    # Remove gallery from its original place
    $content = $content -replace $pattern, ''
    
    # Insert gallery before Event Section
    $eventPattern = '([ \t]*<!-- Event Section -->)'
    $content = $content -replace $eventPattern, ($galleryBlock + "`$1")
    
    [IO.File]::WriteAllText('index.html', $content)
    Write-Output "SUCCESS"
} else {
    Write-Output "FAILED TO MATCH GALLERY"
}
