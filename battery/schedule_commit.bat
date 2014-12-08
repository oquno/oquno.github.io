@echo off
set GIT=C:\cygwin\bin\git
set REPO_DIR=C:\cygwin\home\oquno\oquno.github.io
call %REPO_DIR%\battery\battery.bat
cd %REPO_DIR%
%GIT% add battery/index.html
%GIT% commit -m "scheduled commit"