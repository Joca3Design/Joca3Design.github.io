# Prompt for the destination path
$dest = Read-Host "Where do you want to save your user simulation folders? (e.g., C:\Temp\UserSim)"

# Check if directory exists, if not, create it
if (-not (Test-Path $dest)) {
    try {
        New-Item -ItemType Directory -Path $dest -ErrorAction Stop | Out-Null
        Write-Host "Created base directory: $dest" -ForegroundColor Green
    } catch {
        Write-Host "Failed to create directory. Please ensure you have permission and the path is valid." -ForegroundColor Red
        exit
    }
}

# Define the simulated folder structure
$folders = @(
    "Documents\Work",
    "Documents\Personal",
    "Documents\Finances",
    "Photos\Travel",
    "Photos\Family",
    "Videos\Clips",
    "Music\Playlists",
    "Games\Saves",
    "Games\Mods",
    "Downloads\Software",
    "Downloads\Archives"
)

# Create the folder tree
Write-Host "`nCreating folder structure..." -ForegroundColor Cyan
foreach ($folder in $folders) {
    $path = Join-Path $dest $folder
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    Write-Host "  -> Created: $folder" -ForegroundColor DarkGray
}

# ---------------------------------------------------------
# 1. Generate Dummy Files (Various Formats)
# ---------------------------------------------------------
Write-Host "`nGenerating random simulated files..." -ForegroundColor Cyan

# Pool of names and extensions to mix and match
$fileNames = @("Project_Alpha", "Q3_Report", "Budget_Draft", "Notes", "Readme", "Setup", "Config", "DataDump", "Vacation_Itinerary", "Tax_Returns")
$extensions = @(".docx", ".xlsx", ".pdf", ".txt", ".csv", ".log", ".mp3", ".mp4", ".zip", ".json", ".xml", ".iso")

foreach ($folder in $folders) {
    $fullFolderPath = Join-Path $dest $folder
    
    # Create between 3 to 7 random files per folder
    $fileCount = Get-Random -Minimum 3 -Maximum 8
    
    for ($i = 0; $i -lt $fileCount; $i++) {
        $ext = Get-Random -InputObject $extensions
        $randomName = Get-Random -InputObject $fileNames
        $randomNum = Get-Random -Minimum 1000 -Maximum 9999
        $fileName = "$randomName`_$randomNum$ext"
        $fullPath = Join-Path $fullFolderPath $fileName
        
        # Inject random text content so the file isn't entirely empty
        $content = "Simulated File Data`r`nID: $([guid]::NewGuid())`r`nGenerated on: $(Get-Date)"
        Set-Content -Path $fullPath -Value $content
    }
}

# ---------------------------------------------------------
# 2. Download Real Stock Files (Images)
# ---------------------------------------------------------
Write-Host "`nDownloading real stock images from the web..." -ForegroundColor Cyan

# Folders where we specifically want real downloaded media
$mediaFolders = @("Photos\Travel", "Photos\Family", "Downloads\Archives", "Documents\Personal")

foreach ($folder in $mediaFolders) {
    $fullFolderPath = Join-Path $dest $folder
    
    # Download 2 to 4 real images per media folder
    $imgCount = Get-Random -Minimum 2 -Maximum 5
    
    for ($i = 0; $i -lt $imgCount; $i++) {
        # Using Picsum for random high-quality stock images
        # Adding a random seed to the URL ensures we don't get cached duplicate images
        $randomSeed = Get-Random -Minimum 1 -Maximum 100000
        $apiUrl = "https://picsum.photos/800/600?random=$randomSeed"
        
        $fileName = "Stock_Photo_$randomSeed.jpg"
        $fullPath = Join-Path $fullFolderPath $fileName
        
        try {
            Invoke-WebRequest -Uri $apiUrl -OutFile $fullPath -UseBasicParsing
            Write-Host "  -> Downloaded: $fileName into $folder" -ForegroundColor Green
        } catch {
            Write-Host "  -> Failed to download image to $folder (Check internet connection)" -ForegroundColor Red
        }
    }
}

Write-Host "`nSimulation complete! Your files are ready at: $dest" -ForegroundColor Green
Invoke-Item $dest # Opens the folder automatically in Windows Explorer
