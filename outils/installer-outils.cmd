@echo off
setlocal EnableExtensions
title Installation des outils - Attaques Windows
echo ============================================================
echo   Installation des outils d'attaque (Windows)
echo   nmap, Impacket, NetExec, enum4linux-ng, Responder, PsExec
echo ============================================================
echo   A n'utiliser que sur un reseau de test dont vous avez
echo   l'autorisation. Idealement dans une machine virtuelle.
echo ============================================================
echo.

rem --- Droits administrateur obligatoires (winget + exclusion Defender) ---
net session >nul 2>nul
if errorlevel 1 (
  echo [X] Ce script doit etre lance en administrateur.
  echo     Clic droit sur "installer-outils.cmd" ^> "Executer en tant qu'administrateur",
  echo     ou ouvrez un terminal admin puis relancez-le.
  goto :fin
)
echo [OK] Droits administrateur confirmes.

rem --- Exclusion Windows Defender ---------------------------------------------
rem Impacket, NetExec et Responder contiennent des scripts que Defender supprime
rem comme "virus" (HackTool) pendant l'installation. On exclut les deux dossiers
rem qui les recoivent. Pour annuler plus tard :
rem   Remove-MpPreference -ExclusionPath "%LOCALAPPDATA%\pipx"
rem   Remove-MpPreference -ExclusionPath "%USERPROFILE%\outils-attaques"
echo [..] Ajout des exclusions Defender (dossiers pipx et outils-attaques)...
powershell -NoProfile -Command "Add-MpPreference -ExclusionPath '%LOCALAPPDATA%\pipx' -ErrorAction SilentlyContinue; Add-MpPreference -ExclusionPath '%USERPROFILE%\outils-attaques' -ErrorAction SilentlyContinue"
if errorlevel 1 (
  echo [!] Exclusion non ajoutee (Defender absent ou protection contre les
  echo     falsifications active). L'installation peut echouer sur impacket/netexec.
) else (
  echo [OK] Exclusions Defender ajoutees.
)

rem --- winget : gestionnaire de paquets integre a Windows 10/11 ---
where winget >nul 2>nul
if errorlevel 1 (
  echo [X] winget est introuvable.
  echo     Installez "App Installer" depuis le Microsoft Store puis relancez.
  echo     https://apps.microsoft.com/detail/9NBLGGH4NNS1
  goto :fin
)
echo [OK] winget detecte.

rem --- nmap ---
call :assure_cmd nmap "Insecure.Nmap" "nmap"

rem --- Git (necessaire pour cloner Responder et installer NetExec) ---
call :assure_cmd git "Git.Git" "Git"

rem --- Python 3 (detecte via python puis via le lanceur py) ---
set "PY="
python -V >nul 2>nul && set "PY=python"
if not defined PY ( py -3 -V >nul 2>nul && set "PY=py -3" )
if not defined PY (
  echo [..] Installation de Python 3...
  winget install --id Python.Python.3.12 -e --source winget --accept-package-agreements --accept-source-agreements
  python -V >nul 2>nul && set "PY=python"
  if not defined PY ( py -3 -V >nul 2>nul && set "PY=py -3" )
) else (
  echo [OK] Python deja present.
)

if not defined PY (
  echo.
  echo [!] Python vient d'etre installe mais n'est pas encore dans le PATH
  echo     de cette fenetre. Rouvrez un terminal admin et relancez ce script pour
  echo     terminer l'installation d'Impacket, NetExec et enum4linux-ng.
  goto :psexec
)

rem --- pip + pipx (installation isolee des outils Python) ---
%PY% -m pip --version >nul 2>nul
if errorlevel 1 (
  echo [X] pip indisponible pour cette installation de Python.
  goto :psexec
)
%PY% -m pipx --version >nul 2>nul
if errorlevel 1 (
  echo [..] Installation de pipx...
  %PY% -m pip install --user --upgrade pipx
  %PY% -m pipx ensurepath
) else (
  echo [OK] pipx deja present.
)

rem --- Outils Python (pipx = pas de doublon, environnements isoles) ---
rem  Impacket est sur PyPI ; NetExec et enum4linux-ng n'y sont pas (ou plus) :
rem  on les installe depuis leur depot GitHub officiel.
call :assure_pipx impacket "impacket"
call :assure_pipx netexec "git+https://github.com/Pennyw0rth/NetExec"
call :assure_pipx enum4linux-ng "git+https://github.com/cddmp/enum4linux-ng"

rem --- Responder (clone officiel, seulement s'il est absent) ---
set "RESP=%USERPROFILE%\outils-attaques\Responder"
if exist "%RESP%\Responder.py" (
  echo [OK] Responder deja present dans %RESP%.
) else (
  echo [..] Clonage de Responder...
  git clone --depth 1 https://github.com/lgandx/Responder "%RESP%"
)

:psexec
rem --- PsExec (Sysinternals) ---
where psexec >nul 2>nul
if errorlevel 1 (
  echo [..] Installation de PsExec (Sysinternals)...
  winget install --id Microsoft.Sysinternals.PsExec -e --source winget --accept-package-agreements --accept-source-agreements
  if errorlevel 1 winget install --id Microsoft.Sysinternals -e --source winget --accept-package-agreements --accept-source-agreements
) else (
  echo [OK] PsExec deja present.
)

echo.
echo [OK] Termine. Fermez puis rouvrez votre terminal pour recharger le PATH.
goto :fin

:assure_cmd
rem %1 = commande a tester, %2 = id winget, %3 = nom affiche
where %1 >nul 2>nul
if errorlevel 1 (
  echo [..] Installation de %3...
  winget install --id %2 -e --source winget --accept-package-agreements --accept-source-agreements
) else (
  echo [OK] %3 deja present.
)
exit /b 0

:assure_pipx
rem %1 = nom du paquet dans pipx, %2 = paquet (nom PyPI ou URL git) a installer
%PY% -m pipx list 2>nul | findstr /I /C:"package %1 " >nul
if errorlevel 1 (
  echo [..] Installation de %1 via pipx...
  %PY% -m pipx install %2
) else (
  echo [OK] %1 deja installe via pipx.
)
exit /b 0

:fin
echo.
pause
exit /b
