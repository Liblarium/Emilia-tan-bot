@echo off
set TEMPLATE_DIR=..\..\docs\.templates
set TARGET_DIRS=core database decorators discord logger media network types utils

for %%d in (%TARGET_DIRS%) do (
    echo 🔄 Copying templates to %%d...
    if not exist ".\packages\%%d\src" mkdir ".\packages\%%d\src"

    if exist ".\packages\%%d\package.json" (
        set /p overwrite="⚠️  .\packages\%%d\package.json already exists. Overwrite? (y/N): "
        if /I "%overwrite%"=="Y" (
            powershell -Command "(Get-Content %TEMPLATE_DIR%\package.template.json) -replace 'PACKAGE_NAME', '%%d' | Set-Content .\packages\%%d\package.json"
        )
    ) else (
        powershell -Command "(Get-Content %TEMPLATE_DIR%\package.template.json) -replace 'PACKAGE_NAME', '%%d' | Set-Content .\packages\%%d\package.json"
    )

    for %%f in (tsconfig.json .swcrc) do (
        if exist ".\packages\%%d\%%f" (
            set /p overwrite="⚠️  .\packages\%%d\%%f already exists. Overwrite? (y/N): "
            if /I "%overwrite%"=="Y" (
                copy "%TEMPLATE_DIR%\%%f.template.json" ".\packages\%%d\%%f" >nul
            )
        ) else (
            copy "%TEMPLATE_DIR%\%%f.template.json" ".\packages\%%d\%%f" >nul
        )
    )
)

echo ✅ Done!
pause
