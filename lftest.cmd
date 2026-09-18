:<<"::X"
@echo off
echo debut
call :sub hello
if 1==1 ( echo bloc-ok ) else ( echo non )
goto :fin
:sub
echo   sub=