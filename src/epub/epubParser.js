import loadEPUB from 'jw-epub-parser';
import { dbGetAssTypeId } from "../indexedDb/dbAssignment";
import { dbSaveSrcData } from "../indexedDb/dbSourceMaterial";

const dateFormat = require("dateformat");

export const addEpubDataToDb = async (fileEPUB) => {
    try {
        const data = await loadEPUB(fileEPUB);
        for(let i=0; i < data.weeksData.length; i++) {
            const src = data.weeksData[i];
            const cnAYF = src.ayfCount;

            var obj = {};
            var toSplit1;
            var assType = "";
            var assSource = "";

            //WeekOf Source
            let dayParse = src.weekDate.split("-");
            let varDay;
            let varMonth;
            let monthParse;

            if (dayParse.length === 2) {
                varDay = dayParse[0];
                monthParse = dayParse[1].split(" ");
                varMonth = monthParse[1];
                
            } else {
                dayParse = src.weekDate.split("–");
                monthParse = dayParse[0].split(" ");
                varDay = monthParse[0];
                varMonth = monthParse[1];
            }

            let monthIndex = 0;
            if (varMonth === "Janoary") {
                monthIndex = 0
            } else if (varMonth === "Febroary") {
                monthIndex = 1
            } else if (varMonth === "Martsa") {
                monthIndex = 2
            } else if (varMonth === "Aprily") {
                monthIndex = 3
            } else if (varMonth === "Mey") {
                monthIndex = 4
            } else if (varMonth === "Jona") {
                monthIndex = 5
            } else if (varMonth === "Jolay") {
                monthIndex = 6
            } else if (varMonth === "Aogositra") {
                monthIndex = 7
            } else if (varMonth === "Septambra") {
                monthIndex = 8
            } else if (varMonth === "Oktobra") {
                monthIndex = 9
            } else if (varMonth === "Novambra") {
                monthIndex = 10
            } else if (varMonth === "Desambra") {
                monthIndex = 11
            }

            const schedDate = new Date(data.mwbYear, monthIndex, varDay);
            obj.weekOf = dateFormat(schedDate, "mm/dd/yyyy");

            //Bible Reading Source
            toSplit1 = src.tgwBRead.split(".) ");
            assType = toSplit1[1];
            assType = assType.trim();
            obj.bibleReading_src = assType;

            //AYF1 Assignment Type
            toSplit1 = src.ayfPart1.split(": (");
            assType = toSplit1[0];
            assType = assType.trim();
            assType = await dbGetAssTypeId(assType);
            if (assType === "") {
                assType = "7"
            }
            obj.ass1_type = assType;

            //AYF1 Assignment Time
            toSplit1 = src.ayfPart1.split(": (");
            toSplit1 = toSplit1[1].match(/(\d+)/)[0];
            obj.ass1_time = toSplit1[0];

            //AYF1 Assignment Source
            if (assType === "7") {
                assSource = src.ayfPart1;
            } else {
                toSplit1 = src.ayfPart1.split("min.) ");
                assSource = toSplit1[1];
            }
            obj.ass1_src = assSource;

            obj.ass2_type = "";
            obj.ass2_time = "";
            obj.ass2_src = "";
            obj.ass3_type = "";
            obj.ass3_time = "";
            obj.ass3_src = "";

            if (cnAYF > 1) {
                //AYF2 Assignment Type
                toSplit1 = src.ayfPart2.split(": (");
                assType = toSplit1[0];
                assType = assType.trim();
                assType = await dbGetAssTypeId(assType);
                if (assType === "") {
                    assType = "7"
                }
                obj.ass2_type = assType;

                //AYF2 Assignment Time
                toSplit1 = src.ayfPart2.split(": (");
                toSplit1 = toSplit1[1].match(/(\d+)/)[0];
                obj.ass2_time = toSplit1[0];

                //AYF2 Assignment Source
                if (assType === "7") {
                    assSource = src.ayfPart2;
                } else {
                    toSplit1 = src.ayfPart2.split("min.) ");
                    assSource = toSplit1[1];
                }
                obj.ass2_src = assSource;
            }

            if (cnAYF > 2) {
                //AYF3 Assignment Type
                toSplit1 = src.ayfPart3.split(": (");
                assType = toSplit1[0];
                assType = assType.trim();
                assType = await dbGetAssTypeId(assType);
                if (assType === "") {
                    assType = "7"
                }
                obj.ass3_type = assType;

                //AYF3 Assignment Time
                toSplit1 = src.ayfPart3.split(": (");
                toSplit1 = toSplit1[1].match(/(\d+)/)[0];
                obj.ass3_time = toSplit1[0];

                //AYF3 Assignment Source
                if (assType === "7") {
                    assSource = src.ayfPart3;
                } else {
                    toSplit1 = src.ayfPart3.split("min.) ");
                    assSource = toSplit1[1];
                }
                obj.ass3_src = assSource;
            }

            obj.week_type = 1;
            obj.noMeeting = false;
            obj.isOverride = false;

            await dbSaveSrcData(obj);
        }
    } catch (err) {
        console.log(err);
        return "error";
    }
}