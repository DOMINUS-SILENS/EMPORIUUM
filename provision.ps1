Write-Host "==> Build & start all services (detached mode)..."
docker-compose up --build -d

Write-Host "==> Attendre le démarrage du backend..."
Start-Sleep -Seconds 10

Write-Host "==> Appliquer les migrations (si applicable)..."
try {
    docker-compose exec backend alembic upgrade head
} catch {
    Write-Host "Pas de migrations à appliquer"
}

Write-Host "==> Provisionner des comptes de test (API backend)..."
try {
    Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/register" -ContentType "application/json" -Body '{"email":"vendeur@example.com","password":"vendeur123","full_name":"Test Vendeur","role":"vendeur"}'
    Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/register" -ContentType "application/json" -Body '{"email":"acheteur@example.com","password":"acheteur123","full_name":"Test Acheteur","role":"acheteur"}'
} catch {
    Write-Host "Erreur lors du provisioning des comptes de test"
}

Write-Host "==> Vérification des services..."
foreach ($url in @("http://localhost:3000","http://localhost:3001","http://localhost:3002","http://localhost:8000/docs")) {
    try {
        Invoke-WebRequest -Uri $url -UseBasicParsing | Out-Null
        Write-Host "$url OK"
    } catch {
        Write-Host "$url KO"
    }
}

Write-Host "==> Provisioning terminé !"
