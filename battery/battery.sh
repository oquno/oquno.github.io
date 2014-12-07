USER_NAME=oquno
OUT_NAME=battery-report.html
REPO=~/${USER_NAME}.github.io/
BATTERY_PATH=battery/index.html
powercfg /batteryreport
mv ${OUT_NAME} ${REPO}${BATTERY_PATH}
