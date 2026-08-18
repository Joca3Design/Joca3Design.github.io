# Disable progress bar to significantly speed up Invoke-WebRequest downloads
$ProgressPreference = 'SilentlyContinue'

# Prompt the user for the destination path
$basePath = Read-Host "Where do you want to save your user simulation folders? (e.g., C:\Temp\SimulatedUser or .\MyFakeUser)"

# Validate and create base directory
if ([string]::IsNullOrWhiteSpace($basePath)) {
    Write-Warning "No path provided. Exiting script."
    exit
}

if (-not (Test-Path $basePath)) {
    Write-Host "Creating base directory at $basePath..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $basePath | Out-Null
}

# Define the folder structure
$directories = @(
    "Documents\Work",
    "Documents\Personal",
    "Pictures\PhotosTravel",
    "Pictures\Memes",
    "Pictures\Screenshots",
    "Videos\Clips",
    "Videos\Movies",
    "Music\Playlists",
    "Games\Saves",
    "Downloads\Software",
    "Downloads\Archives"
)

Write-Host "Creating folder structure..." -ForegroundColor Cyan
foreach ($dir in $directories) {
    $fullPath = Join-Path $basePath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

# Helper function to download a file or create a dummy file if the URL fails
function Get-WebFile {
    param (
        [string]$url,
        [string]$destPath
    )
    try {
        Invoke-WebRequest -Uri $url -OutFile $destPath -UseBasicParsing -ErrorAction Stop
        Write-Host " [v] Downloaded: $(Split-Path $destPath -Leaf)" -ForegroundColor DarkGray
    } catch {
        # Fallback: Create an empty dummy file so the simulation still has the correct file extension
        New-Item -ItemType File -Path $destPath -Force | Out-Null
        Write-Host " [x] Link failed, created dummy file: $(Split-Path $destPath -Leaf)" -ForegroundColor DarkYellow
    }
}

Write-Host "`nPopulating folders with files. This might take a minute..." -ForegroundColor Cyan

# --- 1. Pictures (JPEG, PNG, GIF) ---
Write-Host "-> Generating Pictures..." -ForegroundColor Green
for ($i = 1; $i -le 3; $i++) {
    # Random JPEG from Picsum
    Get-WebFile "https://picsum.photos/800/600" (Join-Path $basePath "Pictures\PhotosTravel\vacation_2025_0$i.jpeg")
    # Generated PNG from DummyImage
    Get-WebFile "https://dummyimage.com/600x400/282c34/61dafb.png&text=Meme+$i" (Join-Path $basePath "Pictures\Memes\dank_meme_$i.png")
    # Generated GIF from DummyImage
    Get-WebFile "https://dummyimage.com/1920x1080/000/fff.gif&text=Screenshot_Level_$i" (Join-Path $basePath "Pictures\Screenshots\game_screen_$i.gif")
}

# --- 2. Documents (TXT, CSV, PDF, JSON) ---
Write-Host "-> Generating Documents..." -ForegroundColor Green
"Date,Client,Hours`n2025-08-10,Acme Corp,4.5`n2025-08-11,Globex,8" | Out-File (Join-Path $basePath "Documents\Work\Timesheet_Aug.csv") -Encoding utf8
"Meeting Notes:`n- Discuss project architecture.`n- Update UI to dark mode." | Out-File (Join-Path $basePath "Documents\Work\Meeting_Notes.txt") -Encoding utf8
"To-Do List:`n1. Buy groceries`n2. Call mom`n3. Fix motorcycle" | Out-File (Join-Path $basePath "Documents\Personal\Reminders.txt") -Encoding utf8
# Real sample PDF from W3C
Get-WebFile "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" (Join-Path $basePath "Documents\Work\Tax_Guidelines_2025.pdf")

# --- 3. Music (MP3) ---
Write-Host "-> Generating Music..." -ForegroundColor Green
# Public domain / free sample MP3
Get-WebFile "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" (Join-Path $basePath "Music\Playlists\Chill_Mix_01.mp3")
Get-WebFile "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" (Join-Path $basePath "Music\Playlists\Workout_Track.mp3")

# --- 4. Videos (MP4) ---
Write-Host "-> Generating Videos..." -ForegroundColor Green
# Google's open source Big Buck Bunny / sample MP4 repository
Get-WebFile "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" (Join-Path $basePath "Videos\Clips\Gameplay_Highlight.mp4")

# --- 5. Games (JSON, INI) ---
Write-Host "-> Generating Game Saves & Configs..." -ForegroundColor Green
"{`n `"playerName`": `"Hero`",`n `"level`": 42,`n `"health`": 100,`n `"inventory`": [`"Sword`", `"Potion`"]`n}" | Out-File (Join-Path $basePath "Games\Saves\slot_01_autosave.json") -Encoding utf8
"[Graphics]`nResolution=1920x1080`nFullscreen=true`nVSync=false`n`n[Audio]`nMasterVolume=80" | Out-File (Join-Path $basePath "Games\settings.ini") -Encoding utf8

# --- 6. Downloads (ZIP, EXE dummy) ---
Write-Host "-> Generating Downloads..." -ForegroundColor Green
# Small zip from a tiny public GitHub repo
Get-WebFile "https://github.com/octocat/Hello-World/archive/refs/heads/master.zip" (Join-Path $basePath "Downloads\Archives\source_code_backup.zip")
# Dummy installer file (Just an empty file with an .exe extension for realism)
New-Item -ItemType File -Path (Join-Path $basePath "Downloads\Software\VLC_Setup.exe") -Force | Out-Null
Write-Host " [v] Created dummy installer: VLC_Setup.exe" -ForegroundColor DarkGray

Write-Host "`nDone! User simulation successfully built at:" -ForegroundColor Green
Write-Host $basePath -ForegroundColor Yellow

# Re-enable the progress bar for future scripts in this session
$ProgressPreference = 'Continue'
