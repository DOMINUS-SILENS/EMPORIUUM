# PowerShell Script to Convert JSON Schemas to Zod Schemas - DEBUG VERSION

Write-Host "DEBUG: Script execution started."

# 1. Configuration
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

$SourceDir = Join-Path $ProjectRoot "temp_json_schemas"
$DestinationDir = Join-Path $ProjectRoot "packages/schemas/src"

Write-Host "--- Starting JSON Schema to Zod generation ---"
Write-Host "DEBUG: Project Root: $ProjectRoot"
Write-Host "DEBUG: Source directory: $SourceDir"
Write-Host "DEBUG: Destination directory: $DestinationDir"

# 2. Validate Source Directory
if (-not (Test-Path $SourceDir)) {
    Write-Host "[FATAL ERROR] Source directory '$SourceDir' not found. Aborting."
    exit 1
}
Write-Host "DEBUG: Source directory confirmed."

# 3. Ensure destination directory exists and is clean
Write-Host "DEBUG: Checking destination directory..."
if (-not (Test-Path $DestinationDir)) {
    Write-Host "DEBUG: Destination does not exist. Creating..."
    New-Item -ItemType Directory -Force -Path $DestinationDir
    Write-Host "DEBUG: Created destination directory."
} else {
    Write-Host "DEBUG: Destination exists. Cleaning..."
    Get-ChildItem -Path $DestinationDir -Filter *.ts | Remove-Item -Force
    Write-Host "DEBUG: Cleaned destination directory."
}

# 4. Get all JSON schema files
Write-Host "DEBUG: Searching for JSON files in source..."
$JsonFiles = Get-ChildItem -Path $SourceDir -Filter *.json

if ($JsonFiles.Count -eq 0) {
    Write-Host "[WARNING] No JSON schema files found in $SourceDir. Exiting."
    exit
}

Write-Host "DEBUG: Found $($JsonFiles.Count) JSON files to convert."

# 5. Loop and convert
foreach ($File in $JsonFiles) {
    $SourceName = $File.Name
    $DestinationName = $File.BaseName + ".ts"
    $SourcePath = $File.FullName
    $DestinationPath = Join-Path $DestinationDir $DestinationName

    Write-Host "Converting $SourceName -> $DestinationName..."

    npx json-schema-to-zod -i $SourcePath -o $DestinationPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  `e[92m-> Success`e[0m"
    } else {
        Write-Host "  `e[91m-> FAILED (Exit Code: $LASTEXITCODE)`e[0m"
    }
}

Write-Host "--- Zod schema generation complete. ---"
