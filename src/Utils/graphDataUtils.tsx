import moment from "moment";
import {ICalculationData, IGraphData} from "@/types/Data.ts";

const openingTimes = (data: ICalculationData) => {
    const dataArray = []
    if (data.laboratoryAllDay) {
        for (let day = 0; day < 7; day++) {
            const start = 0 + day * 24;
            const end = 24 + day * 24;
            const weekday = (Number(data.arrivalDay) + day) % 7 //(data.arrivalDay + day) % 7
            dataArray.push({start: start, end: end, weekday: weekday})
        }
        return dataArray;
    }

    if (data.laboratoryMultiDay) {
        for (let i = 0; i < 7; i++) {
            const day = (Number(data.arrivalDay) + i) % 7
            const start = Number(moment(data.laboratoryHours[i].startTime, "hh:mm").format("HH")) + i * 24
            const end = Number(moment(data.laboratoryHours[i].endTime, "hh:mm").format("HH")) + i * 24

            dataArray.push({start: start, end: end, weekday: day})
        }
        return dataArray;
    }

    for (let day = 0; day < 7; day++) {
        const startH = Number(moment(data.laboratoryHours[10].startTime, "hh:mm").format("HH")) + day * 24;
        const endH = Number(moment(data.laboratoryHours[10].endTime, "hh:mm").format("HH")) + day * 24;
        const weekday = (Number(data.arrivalDay) + day) % 7
        dataArray.push({start: startH, end: endH, weekday: weekday})
    }
    // console.log(dataArray)
    return dataArray;
}

const checkStartTimeInsideOpeningHours = (data: ICalculationData, start: number, end: number) => {
    const intervals = openingTimes(data)

    let adjustedStart = null

    const foundIntervals = intervals.find(interval => start >= interval.start && start <= interval.end)

    if (foundIntervals) {
        adjustedStart = foundIntervals.start;
    } else {
        const nextIntervalIndex = intervals.findIndex(interval => interval.start > start);
        if (nextIntervalIndex !== -1) {
            adjustedStart = intervals[nextIntervalIndex].start;
        }
    }


    if (adjustedStart !== null && adjustedStart > start) {
        const distance = end - start;
        start = adjustedStart;
        end = start + distance
    }

    return [start, end];
}

const getHours = (time: moment.MomentInput) => {
    return Number(moment(time, "hh:mm").format("HH"))
}

const calculateArriveTimeEnd = (data: ICalculationData) => {
    return Number(moment(data.arrivalTime, "hh:mm").format("HH")) + 1;
}

const calculateTransportTimeEnd = (data: ICalculationData) => {
    return Number(calculateArriveTimeEnd(data)) + Number(data.transportTime)
}

const calculateIncubationEnd = (data: ICalculationData) => {
    return Number(calculateTransportTimeEnd(data)) + Number(data.incubation)
}

const graphDataCalculation = (data: ICalculationData): IGraphData[] => {
    const time1 = () => {
        return [getHours(data.arrivalTime), getHours(data.arrivalTime) + 1]
    }

    const time2 = () => {
        return [getHours(data.arrivalTime) + 1, calculateTransportTimeEnd(data)]
    }

    const time3 = () => {
        return (checkStartTimeInsideOpeningHours(data, calculateTransportTimeEnd(data), calculateIncubationEnd(data)))
    }
    const time4 = () => {
        return (checkStartTimeInsideOpeningHours(data, time3()[1], Number(time3()[1] + Number(data.germGrouping))))
    }
    const time5 = () => {
        return (checkStartTimeInsideOpeningHours(data, time4()[1], Number(time4()[1] + Number(data.germGrow))))
    }
    const time6 = () => {
        return (checkStartTimeInsideOpeningHours(data, time5()[1], Number(time5()[1] + Number(data.germTypeMethod.time))))
    }
    const time7 = () => {
        return (checkStartTimeInsideOpeningHours(data, time6()[1], Number(time6()[1] + Number(data.antibioticMethod.time))))
    }
    const time8 = () => {
        return (checkStartTimeInsideOpeningHours(data, time7()[1], Number(time7()[1] + Number(data.communicationPatient))))
    }

    // time: previous end, previous + duration
    // const time = (previous, duration) => {
    //     return [getHours(previous), Number(calculateArriveTimeEnd(data)) + Number(data.transportTime)]
    // }
//todo: generate from processlist
    // start = array[i-1].time[1]
    return [
        {
            name: 'Blutkultur Entnahme',
            time: time1(),
            duration: "1",
        },
        {
            name: 'Transport',
            time: time2(),
            duration: data.transportTime,
        },
        {
            name: 'Inkubation',
            wait: [time2()[1],time3()[0]],
            time: time3(),
            duration: data.incubation,
        },
        {
            name: 'Gramfärbung',
            wait: [time3()[1],time4()[0]],
            time: time4(), //[32, 33],
            duration: data.germGrouping,
        },
        {
            name: 'Anzucht des Keims',
            wait: [time4()[1],time5()[0]],
            time: time5(),//[33, 43],
            duration: data.germGrow,
        },
        {
            name: 'Keimart Erkennung',
            wait: [time5()[1],time6()[0]],
            time: time6(), //[56, 57],
            duration: data.germTypeMethod.time,
        },
        {
            name: 'Antibiogram',
            wait: [time6()[1],time7()[0]],
            time: time7(), //[57, 63],
            duration: data.antibioticMethod.time,
        },
        {
            name: 'Kommunikation Krankenhaus',
            wait: [time7()[1],time8()[0]],
            time: time8(), //[63, 64],
            duration: data.communicationPatient,
        },
    ]
}

// const graphDataCalculationWithWaitingTime = (data: ICalculationData) => {
//     // const graphData = []
//     //let timePassed = 0
//     // for (const process of processSteps): {
//     //     const processGraphData = {
//     //             name: process.name,
//     //             invisible: data.arrivalTime,
//     //             wait: ( process.dependOnOpeningHours ? checkStartTimeInsideOpeningHours() : 0),
//     //             time: getHours(data.arrivalTime) + 1,
//     //             duration: 1 + "h",
//     //         }
//     //      timePassed = timePassed + process.time
//     //     graphData.push(...graphData, processGraphData)
//     // }
//
//     return [
//         {
//             name: 'Blutkultur Entnahme',
//             invisible: getHours(data.arrivalTime), //previous
//             wait: 0,
//             time: data.arrivalDuration, //duration
//             duration: 1 + "h",
//         },
//         {
//             name: 'Transport',
//             invisible: getHours(data.arrivalTime) + data.arrivalDuration, //AddWholeDay(previous)
//             wait: 0,
//             time: data.transportTime,
//             duration: data.transportTime + "h",
//         },
//         {
//             name: 'Inkubation',
//             invisible: getHours(data.arrivalTime) + data.arrivalDuration + data.transportTime,
//             wait: 5,
//             time: 16,
//             duration: 16 + "h",
//         },
//         {
//             name: 'Gramfärbung',
//             invisible: 24,
//             wait:8,
//             time: 1,
//             duration: 1 + "h",
//         },
//         {
//             name: 'Anzucht auf Agarplatte',
//             invisible: 33,
//             wait: 0,
//             time: 10,
//             duration: 10 + "h",
//         },
//         {
//             name: 'Keimart Erkennung',
//             invisible: 43,
//             wait: 13,
//             time: 1,
//             duration: 1 + "h",
//         },
//         {
//             name: 'Antibiogram',
//             invisible: 57,
//             wait: 0,
//             time: 6,
//             duration: 6 + "h",
//         },
//         {
//             name: 'Kommunikation Krankenhaus',
//             invisible: 63,
//             wait:0,
//             time: 1,
//             duration: 1 + "h",
//         },
//     ];
// }

export {graphDataCalculation, openingTimes}