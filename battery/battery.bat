@echo off
set CPU=%1
set USER_NAME=oquno
set OUT_PATH="C:\cygwin%CPU%\home\%USER_NAME%\%USER_NAME%.github.io\battery\%COMPUTERNAME%.html"
echo %OUT_PATH%
powercfg /batteryreport /output %OUT_PATH%
