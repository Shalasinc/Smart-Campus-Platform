# Phase 2 Test Script - Smart Campus Platform
# This script automatically runs Phase 2 tests

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Phase 2 Test - Login and View Resources" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$apiUrl = "http://localhost:8080/api"
$gatewayUrl = "http://localhost:8080/api"
$username = "testuser_$(Get-Random)"
$password = "test123"
$role = "STUDENT"
$tenantId = "faculty_eng"

Write-Host "[1/4] Checking API Gateway connection..." -ForegroundColor Yellow
try {
    $testGateway = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue -ErrorAction Stop
    if ($testGateway.TcpTestSucceeded) {
        Write-Host "[OK] API Gateway is accessible on port 8080" -ForegroundColor Green
    } else {
        throw "Port 8080 is not accessible"
    }
} catch {
    Write-Host "[WARNING] API Gateway is not accessible. Make sure docker compose is running." -ForegroundColor Red
    Write-Host "   Command: cd deployment && docker compose up" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/4] Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    username = $username
    password = $password
    role = $role
    tenantId = $tenantId
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$apiUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "[OK] Registration successful!" -ForegroundColor Green
    Write-Host "   Username: $($registerResponse.username)" -ForegroundColor Gray
    Write-Host "   Role: $($registerResponse.role)" -ForegroundColor Gray
    Write-Host "   User ID: $($registerResponse.userId)" -ForegroundColor Gray
    
    $token = $registerResponse.token
    Write-Host "   Token: $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Gray
} catch {
    $errorDetails = $_.ErrorDetails.Message
    if ($errorDetails -like "*already exists*") {
        Write-Host "[WARNING] User already exists. Attempting login..." -ForegroundColor Yellow
        
        # Login instead of register
        $loginBody = @{
            username = $username
            password = $password
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" `
                -Method POST `
                -ContentType "application/json" `
                -Body $loginBody
            $token = $loginResponse.token
            Write-Host "[OK] Login successful!" -ForegroundColor Green
        } catch {
            Write-Host "[ERROR] Login failed. Please try a different username." -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[ERROR] Registration failed!" -ForegroundColor Red
        if ($errorDetails) {
            Write-Host "   Error: $errorDetails" -ForegroundColor Red
        } else {
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
        exit 1
    }
}

Write-Host ""
Write-Host "[3/4] Testing login..." -ForegroundColor Yellow
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "[OK] Login successful!" -ForegroundColor Green
    $token = $loginResponse.token
    Write-Host "   Token received" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Login failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/4] Viewing resources (with Token)..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    # Use gateway for resources
    $resources = Invoke-RestMethod -Uri "$gatewayUrl/resources" `
        -Method GET `
        -Headers $headers
    
    Write-Host "[OK] Resource viewing successful!" -ForegroundColor Green
    if ($resources.Count -eq 0) {
        Write-Host "   [INFO] Resource list is empty (this is normal if database is empty)" -ForegroundColor Yellow
    } else {
        Write-Host "   Resource count: $($resources.Count)" -ForegroundColor Gray
        $resources | ForEach-Object {
            Write-Host "   - $($_.name) (Capacity: $($_.capacity))" -ForegroundColor Gray
        }
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "[ERROR] 401 Error: Invalid or expired token" -ForegroundColor Red
    } else {
        Write-Host "[ERROR] Error viewing resources!" -ForegroundColor Red
        Write-Host "   Status: $statusCode" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  [SUCCESS] All tests passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "   - Registration: [OK]" -ForegroundColor Green
Write-Host "   - Login: [OK]" -ForegroundColor Green
Write-Host "   - View Resources: [OK]" -ForegroundColor Green
Write-Host ""
Write-Host "Project is ready for Phase 2!" -ForegroundColor Green
