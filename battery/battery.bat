@echo off
set USER_NAME="oquno"
set REPO_DIR="C:\cygwin\home\%USER_NAME%\%USER_NAME%.github.io"
powercfg /batteryreport
move /Y "C:\Users\%USER_NAME%\battery-report.html" "%REPO_DIR%\battery\index.html"