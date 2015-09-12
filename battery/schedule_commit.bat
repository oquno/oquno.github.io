@echo off
set CPU=%1
set GIT=C:\cygwin%CPU%\bin\git
set REPO_DIR=C:\cygwin%CPU%\home\oquno\oquno.github.io
call %REPO_DIR%\battery\battery.bat "%CPU%"
cd %REPO_DIR%
del .git\index.lock
%GIT% add "battery/%COMPUTERNAME%.html"
%GIT% commit -m "scheduled commit"
%GIT% push
