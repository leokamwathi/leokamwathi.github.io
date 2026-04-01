@echo off
:: Navigate to the project directory (optional if run from root)
cd /d "%~dp0"

:: Get the current date and time
set timestamp=%DATE% %TIME%

:: Stage all changes
git add .

:: Commit with the timestamp
:: We use "|| exit /b" to prevent errors if there's nothing to commit
git commit -m "Auto-save: %timestamp%" || echo No changes to commit.