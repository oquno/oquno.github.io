USER_NAME=oquno
OUT_NAME=battery-report.html
REPO=~/${USER_NAME}.github.io/
BATTERY_PATH=battery/index.html
powercfg /batteryreport /output ${REPO}/${BATTERY_PATH}
mv ${OUT_NAME} ${REPO}${BATTERY_PATH}
