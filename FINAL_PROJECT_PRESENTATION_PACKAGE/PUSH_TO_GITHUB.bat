@echo off
title Push AutoCare Pro to GitHub
echo ======================================================================
echo    PUSH TO GITHUB REPOSITORY - AutoCare Pro
echo    Student: Shaik Asif | Roll No: 2403a52220
echo ======================================================================
echo.
echo Step 1: Create an empty repository on GitHub:
echo         https://github.com/new
echo         (Leave "Add README", ".gitignore", and "license" unchecked)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/YourUsername/vehicle-service-management.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL entered. Operation cancelled.
    pause
    exit /b 1
)

echo.
echo [1/3] Setting remote origin to: %REPO_URL%
git -C .. remote remove origin 2>nul
git -C .. remote add origin %REPO_URL%

echo [2/3] Setting branch to main...
git -C .. branch -M main

echo [3/3] Pushing all files to GitHub...
git -C .. push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo  SUCCESS! Your project is now live on GitHub!
    echo  Visit: %REPO_URL%
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo  PUSH FAILED OR NEEDS AUTHENTICATION:
    echo.
    echo  If Git asks for credentials:
    echo  - Username: Your GitHub Username
    echo  - Password: A GitHub Personal Access Token (Classic) with 'repo' scope
    echo    Generate token at: https://github.com/settings/tokens
    echo ======================================================================
)
echo.
pause
