@echo off
title AutoCare Pro - Vehicle Service Management System
echo ======================================================================
echo    ONLINE VEHICLE SERVICE BOOKING & MAINTENANCE MANAGEMENT SYSTEM
echo                           (AutoCare Pro)
echo          Student: Shaik Asif | Roll No: 2403a52220
echo                  Guide: Dr. N. Sharmila Banu
echo           Institution: SR University, Warangal (2026-27)
echo ======================================================================
echo.
echo Starting Backend API Server (Node.js/Express on Port 5000)...
start "AutoCare Pro Backend Server" cmd /k "cd server && node server.js"

echo Waiting for database and backend initialization...
timeout /t 3 > nul

echo Starting Frontend Dev Server (React/Vite on Port 5173)...
start "AutoCare Pro Frontend Client" cmd /k "cd client && npm run dev"

timeout /t 3 > nul
echo.
echo Launching Web Browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ======================================================================
echo System successfully launched!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo Press any key to exit this launcher (servers will remain running).
echo ======================================================================
pause > nul
