@echo off
echo Starting UpliftDoctorOrder on localhost...
echo.
echo Choose your preferred server:
echo 1. Python HTTP Server (Port 8000)
echo 2. Node.js HTTP Server (Port 3000)
echo 3. PHP Built-in Server (Port 8080)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Starting Python server on http://localhost:8000
    python -m http.server 8000
) else if "%choice%"=="2" (
    echo Starting Node.js server on http://localhost:3000
    npx http-server -p 3000
) else if "%choice%"=="3" (
    echo Starting PHP server on http://localhost:8080
    php -S localhost:8080
) else (
    echo Invalid choice. Using Python server as default.
    python -m http.server 8000
)

pause