@echo off
rem Ouvre le site dans le navigateur par defaut.
rem Ce fichier doit rester dans le dossier du site, a cote de index.html.

if not exist "%~dp0index.html" (
    echo.
    echo  Fichier index.html introuvable.
    echo  Placez "Lancer le site.bat" dans le dossier du site, a cote de index.html.
    echo.
    pause
    exit /b 1
)

start "" "%~dp0index.html"
