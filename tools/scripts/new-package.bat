@echo off
setlocal enabledelayedexpansion

if "%~1"=="" (
    echo ❌ Please provide a package name.
    exit /b 1
)

set PACKAGE_NAME=%~1
set TEMPLATE_DIR=..\..\docs\.templates
set TARGET_DIR=.\packages\%PACKAGE_NAME%

if exist "%TARGET_DIR%" (
    echo ⚠️  Package '%PACKAGE_NAME%' already exists at %TARGET_DIR%.
    exit /b 1
)

echo 🚀 Creating new package: %PACKAGE_NAME%...

mkdir "%TARGET_DIR%\src"

powershell -Command "(Get-Content %TEMPLATE_DIR%\package.template.json) -replace 'PACKAGE_NAME', '%PACKAGE_NAME%' | Set-Content %TARGET_DIR%\package.json"
copy "%TEMPLATE_DIR%\tsconfig.template.json" "%TARGET_DIR%\tsconfig.json" >nul
copy "%TEMPLATE_DIR%\.swcrc.template.json" "%TARGET_DIR%\.swcrc" >nul

echo ✅ Package '%PACKAGE_NAME%' created successfully!
