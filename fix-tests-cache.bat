@echo off
REM Clear vitest cache and related caches
cd /d "%~dp0"

echo Clearing vitest caches...

REM Try to remove vitest cache in node_modules
if exist "node_modules\.vitest" (
    echo Removing node_modules\.vitest...
    rmdir /s /q "node_modules\.vitest"
)

REM Clear .next build cache
if exist ".next" (
    echo Removing .next...
    rmdir /s /q ".next"
)

REM Clear coverage
if exist "coverage" (
    echo Removing coverage...
    rmdir /s /q "coverage"
)

REM Try to clear vitest from vite cache locations
if exist ".vite" (
    echo Removing .vite...
    rmdir /s /q ".vite"
)

echo.
echo Caches cleared. Now running tests with --no-cache flag...
echo.

npm.cmd test -- --no-cache

pause
