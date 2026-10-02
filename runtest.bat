@echo off
echo ==============================================================
echo   Running Automated Tests: Pixel Stickers Vault
echo ==============================================================
npm.cmd run test
if %ERRORLEVEL% equ 0 (
    echo [OK] All test suites passed.
) else (
    echo [x] Tests failed!
)
