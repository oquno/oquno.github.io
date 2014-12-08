@echo off
set USER_NAME=oquno
set OUT_PATH="C:\cygwin\home\%USER_NAME%\%USER_NAME%.github.io\battery\index.html"
echo %OUT_PATH%
powercfg /batteryreport /output %OUT_PATH%