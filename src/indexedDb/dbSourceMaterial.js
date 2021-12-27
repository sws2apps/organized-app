import { dbGetAssType } from './dbAssignment';
import appDb from './mainDb';

export const dbGetWeeks = async () => {
    var appData = [];
    var allWeeks = [];

    appData = await appDb.table("src").reverse().sortBy("weekOf");
    var key = 0;
    for(let i=0; i < appData.length; i++) {
        const weekDate = appData[i].weekOf;
        const day = weekDate.split("/")[1];
        const month = weekDate.split("/")[0];
        const year = weekDate.split("/")[2];
        const weekDateFormatted = day + "/" + month + "/" + year;
        var monthName = "";
        var mainOption = {};
        var subOption = {};

        if (month === "01") {
            monthName = "Janoary"
        } else if (month === "02") {
            monthName = "Febroary"
        } else if (month === "03") {
            monthName = "Martsa"
        } else if (month === "04") {
            monthName = "Aprily"
        } else if (month === "05") {
            monthName = "Mey"
        } else if (month === "06") {
            monthName = "Jona"
        } else if (month === "07") {
            monthName = "Jolay"
        } else if (month === "08") {
            monthName = "Aogositra"
        } else if (month === "09") {
            monthName = "Septambra"
        } else if (month === "10") {
            monthName = "Oktobra"
        } else if (month === "11") {
            monthName = "Novambra"
        } else if (month === "12") {
            monthName = "Desambra"
        }
        const tempMain = monthName + " " + year;
        const monthIndex = allWeeks.findIndex(monthData => monthData.label === tempMain);

        if (monthIndex < 0) {
            mainOption.label = tempMain;
            mainOption.key = key;
            key++;
            subOption.label = weekDateFormatted;
            subOption.value = weekDate;
            subOption.key = key;
            key++;
            mainOption.options = [];
            mainOption.options.push(subOption);

            allWeeks.push(mainOption);
        } else {
            subOption.label = weekDateFormatted;
            subOption.value = weekDate;
            subOption.key = key;
            key++;
            var subOptionData = [];
            subOptionData = allWeeks[monthIndex].options;
            subOptionData.push(subOption);
            allWeeks[monthIndex].options = subOptionData;
        }
    }

    return allWeeks;
}

export const dbGetListWeekType = async () => {
    var weekType = [];
    const appData = await appDb.table("week_type").reverse().reverse().sortBy("id_week_type");

    for(let i=0; i < appData.length; i++) {
        var obj = {};
        obj.value = appData[i].id_week_type;
        obj.label = appData[i].week_type_name;
        weekType.push(obj);
    }
    return weekType;
};

export const dbGetScheduleWeekInfo = async (weekOf) => {
    const appData = await appDb.table("sched_MM").get({"weekOf": weekOf});
    var obj = {};
    obj.week_type = appData.week_type;
    obj.noMeeting = appData.noMeeting;
    return obj;
}

export const dbGetWeekTypeName = async (weekType) => {
    var srcWeekType = "";
    if (weekType === "") {
        return srcWeekType;
    } else {
        var i = parseInt(weekType, 10);
        const appData = await appDb.table("week_type").get(i);
        srcWeekType = appData.week_type_name;
        return srcWeekType;
    }
};

export const dbGetSourceMaterial = async (weekOf) => {
    const appData = await appDb.table("src").get({"weekOf": weekOf});
    var obj = {};
    obj.weekOf = appData.weekOf;
    if (typeof appData.bibleReading_src === "undefined") {
        obj.bibleReading_src = "";
    } else {
        obj.bibleReading_src = appData.bibleReading_src;
    }
    if (typeof appData.ass1_type === "undefined" || appData.ass1_type === "") {
        obj.ass1_type = "";
        obj.ass1_type_name = "";
    } else {
        obj.ass1_type = parseInt(appData.ass1_type, 10);
        obj.ass1_type_name = await dbGetAssType(appData.ass1_type);
    }
    if (typeof appData.ass1_time === "undefined") {
        obj.ass1_time = "";
    } else {
        obj.ass1_time = appData.ass1_time;
    }
    if (typeof appData.ass1_src === "undefined") {
        obj.ass1_src = "";
    } else {
        obj.ass1_src = appData.ass1_src;
    }

    if (typeof appData.ass2_type === "undefined" || appData.ass2_type === "") {
        obj.ass2_type = "";
        obj.ass2_type_name = "";
    } else {
        obj.ass2_type = parseInt(appData.ass2_type, 10);
        obj.ass2_type_name = await dbGetAssType(appData.ass2_type);
    }
    if (typeof appData.ass2_time === "undefined") {
        obj.ass2_time = "";
    } else {
        obj.ass2_time = appData.ass2_time;
    }
    if (typeof appData.ass2_src === "undefined") {
        obj.ass2_src = "";
    } else {
        obj.ass2_src = appData.ass2_src;
    }

    if (typeof appData.ass3_type === "undefined" || appData.ass3_type === "") {
        obj.ass3_type = "";
        obj.ass3_type_name = "";
    } else {
        obj.ass3_type = parseInt(appData.ass3_type, 10);
        obj.ass3_type_name = await dbGetAssType(appData.ass3_type);
    }
    if (typeof appData.ass3_time === "undefined") {
        obj.ass3_time = "";
    } else {
        obj.ass3_time = appData.ass3_time;
    }
    if (typeof appData.ass3_src === "undefined") {
        obj.ass3_src = "";
    } else {
        obj.ass3_src = appData.ass3_src;
    }

    if (typeof appData.ass4_type === "undefined" || appData.ass4_type === "") {
        obj.ass4_type = "";
        obj.ass4_type_name = "";
    } else {
        obj.ass4_type = parseInt(appData.ass4_type, 10);
        obj.ass4_type_name = await dbGetAssType(appData.ass4_type);
    }
    if (typeof appData.ass4_time === "undefined") {
        obj.ass4_time = "";
    } else {
        obj.ass4_time = appData.ass4_time;
    }
    if (typeof appData.ass4_src === "undefined") {
        obj.ass4_src = "";
    } else {
        obj.ass4_src = appData.ass4_src;
    }
    const weekSchedInfo = await dbGetScheduleWeekInfo(weekOf);
    obj.week_type = weekSchedInfo.week_type;
    obj.noMeeting = weekSchedInfo.noMeeting;
    const weekTypeName = await dbGetWeekTypeName(weekSchedInfo.week_type);
    obj.week_type_name = weekTypeName;
    return obj;
};

export const dbSaveSrcData = async (srcData) => {
    var isSuccess = false;
    await appDb.table("src").put(
        {
            weekOf: srcData.weekOf,
            bibleReading_src: srcData.bibleReading_src,
            ass1_type: srcData.ass1_type,
            ass1_time: srcData.ass1_time,
            ass1_src: srcData.ass1_src,
            ass2_type: srcData.ass2_type,
            ass2_time: srcData.ass2_time,
            ass2_src: srcData.ass2_src,
            ass3_type: srcData.ass3_type,
            ass3_time: srcData.ass3_time,
            ass3_src: srcData.ass3_src,
            ass4_type: srcData.ass4_type,
            ass4_time: srcData.ass4_time,
            ass4_src: srcData.ass4_src,
        }, srcData.weekOf
    )
    .then(async () => {
        const isSub = await dbSaveSchedData(srcData.weekOf, srcData.week_type, srcData.noMeeting, srcData.isOverride);
        if (isSub === true) {
            isSuccess = true;
        }
    })
    .catch(() => {
        isSuccess = false;
    });
    return isSuccess;
};

const dbSaveSchedData = async (weekOf, weekType, noMeeting, isOverride) => {
    var isSuccess = false;
    const appData = await appDb.table("sched_MM").get({"weekOf": weekOf});
    if (isOverride === false) {
        if (appData !== undefined) {
            weekType = appData.week_type;
            noMeeting = appData.noMeeting;
        }
    }

    if (appData === undefined) {
        await appDb.table("sched_MM").put(
            {
                weekOf: weekOf,
                week_type: weekType,
                noMeeting: noMeeting,
            }, weekOf
        )
        .then(() => {
            isSuccess = true;
        })
        .catch(() => {
            isSuccess = false;
        });
    } else {
        await appDb.table("sched_MM").update(weekOf, 
            {
                weekOf: weekOf,
                week_type: weekType,
                noMeeting: noMeeting,
            }
        )
        .then(() => {
            isSuccess = true;
        })
        .catch((error) => {
            isSuccess = false;
        });
    }

    return isSuccess;
};

export const hasCurrentWeek = async () => {
    var varBool = true;
    var dateFormat = require("dateformat");
    var today = new Date();
    var day = today.getDay();
    var diff = today.getDate() - day + (day === 0 ? -6:1);
    var monDay = new Date(today.setDate(diff));
    const fMonday = dateFormat(monDay, "mm/dd/yyyy");
    const congData = await appDb.table("src").get({"weekOf": fMonday});
    if (typeof congData === "undefined") {
        varBool = false;
    }
    return varBool;
};

export const checkSrcUpdate = async () => {
    var checkCurrentWeek = await hasCurrentWeek();
    if (checkCurrentWeek === false) {
        var dateFormat = require("dateformat");
        var today = new Date();
        var day = today.getDay();
        var diff = today.getDate() - day + (day === 0 ? -6:1);
        var monDay = new Date(today.setDate(diff));
        const fMonday = dateFormat(monDay, "mm/dd/yyyy");
        await dbAddWeekToSource(fMonday);
        await dbAddWeekToSchedule(fMonday);
    }  
}

export const dbAddWeekToSource = async (varSrcWeek) => {
    await appDb.table("src").put({weekOf: varSrcWeek}, varSrcWeek);
};

export const dbAddWeekToSchedule = async (varSchedWeek) => {
    var weekType = 1;
    var noMeeting = false;
    const appData = await appDb.table("sched_MM").get({"weekOf": varSchedWeek});
    if(typeof appData !== "undefined") {
        weekType = appData.week_type;
        noMeeting = appData.noMeeting;
    }

    await appDb.table("sched_MM").put({
        weekOf: varSchedWeek,
        week_type: weekType,
        noMeeting: noMeeting,
        }, varSchedWeek);
};

export const dbGetWeekListBySched = async (scheduleIndex) => {
    var allSchedules = [];

    const appData = await appDb.table("src").reverse().reverse().sortBy("weekOf");

    for(let i=0; i < appData.length; i++) {
        const weekDate = appData[i].weekOf;
        const day = weekDate.split("/")[1];
        const month = weekDate.split("/")[0];
        const year = weekDate.split("/")[2];
        const weekDateFormatted = day + "/" + month + "/" + year;
        const tempMain =  month + "/" + year;
        if (tempMain === scheduleIndex) {
            var obj = {};
            obj.label = weekDateFormatted;
            obj.value = appData[i].weekOf;
            allSchedules.push(obj);
        }
    }
    return allSchedules;
};

export const dbGetYearList = async () => {
    var allYear = [];

    const appData = await appDb.table("src").reverse().reverse().sortBy("weekOf");

    for(let i=0; i < appData.length; i++) {
        const weekDate = appData[i].weekOf;
        const varYear = weekDate.split("/")[2];

        const yearIndex = allYear.findIndex(year => year.label === varYear);

        if (yearIndex < 0) {
            var obj = {};
            obj.label = varYear;
            obj.value = varYear;
            allYear.push(obj);
        }
    }
    return allYear;
};

export const dbGetScheduleListByYear = async (varYear) => {
    var allSchedules = [];

    const appData = await appDb.table("src").reverse().sortBy("weekOf");

    for(let i=0; i < appData.length; i++) {
        const weekDate = appData[i].weekOf;
        const year = weekDate.split("/")[2];

        if (year === varYear) {
            const month = weekDate.split("/")[0];
            var monthName = "";

            if (month === "01") {
                monthName = "Janoary"
            } else if (month === "02") {
                monthName = "Febroary"
            } else if (month === "03") {
                monthName = "Martsa"
            } else if (month === "04") {
                monthName = "Aprily"
            } else if (month === "05") {
                monthName = "Mey"
            } else if (month === "06") {
                monthName = "Jona"
            } else if (month === "07") {
                monthName = "Jolay"
            } else if (month === "08") {
                monthName = "Aogositra"
            } else if (month === "09") {
                monthName = "Septambra"
            } else if (month === "10") {
                monthName = "Oktobra"
            } else if (month === "11") {
                monthName = "Novambra"
            } else if (month === "12") {
                monthName = "Desambra"
            }

            const tempMain = month + "/" + year;
            const scheduleIndex = allSchedules.findIndex(schedule => schedule.value === tempMain);

            if (scheduleIndex < 0) {
                var obj = {};
                obj.label = monthName;
                obj.value = month + "/" + year;
                allSchedules.push(obj);
            }
        }
    }
    return allSchedules;
};

export const dbAddManualSource = async () => {
    var appData = [];
    appData = await appDb.table("src").toArray();
    appData.sort((a, b) => {
        var dateA = a.weekOf.split("/")[2] + "/" + a.weekOf.split("/")[0] + "/" + a.weekOf.split("/")[1];
        var dateB = b.weekOf.split("/")[2] + "/" + b.weekOf.split("/")[0] + "/" + b.weekOf.split("/")[1];
        return dateA > dateB ? 1 : -1;
    });
    console.log(appData);
    var key = appData.length - 1;
    const lastWeek = appData[key].weekOf;
    console.log(lastWeek);
    const day = lastWeek.split("/")[1];
    const month = lastWeek.split("/")[0];
    const year = lastWeek.split("/")[2];
    var result = new Date(year, month - 1, day);
    result.setDate(result.getDate() + 7);
    var dateFormat = require("dateformat");
    const fMonday = dateFormat(result, "mm/dd/yyyy");
    await dbAddWeekToSource(fMonday);
    await dbAddWeekToSchedule(fMonday);
    return;
}

export const dbIsWeekExist = async (varWeek) => {
    let varBool = true;
    const congData = await appDb.table("src").get({"weekOf": varWeek});
    if (typeof congData === "undefined") {
        varBool = false;
    }
    return varBool;
}
