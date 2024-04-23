import moment from "moment";
import {ICalculationData, IGraphData, presetGraphData} from "@/types/Data.ts";

const openingTimes = (data: ICalculationData) => {
    const dataArray = []
    if (data.laboratoryAllDay) {
        for (let day = 0; day < 5; day++) {
            const start = 0 + day * 24;
            const end = 24 + day * 24;
            dataArray.push({start: start, end: end})
        }
        return dataArray;
    }

    if (data.laboratoryMultiDay) {
        const startDay = data.arrivalDay;
        for (let i = 0; i < 5; i++) {
            const day = (startDay + i) % 7
            const start = Number(moment(data.laboratoryHours[day].startTime, "hh:mm").format("HH")) + i * 24
            const end = Number(moment(data.laboratoryHours[day].endTime, "hh:mm").format("HH")) + i * 24

            dataArray.push({start: start, end: end})
        }
        return dataArray;
    }

    for (let day = 0; day < 5; day++) {
        const startH = Number(moment(data.laboratoryHours[10].startTime, "hh:mm").format("HH")) + day * 24;
        const endH = Number(moment(data.laboratoryHours[10].endTime, "hh:mm").format("HH")) + day * 24;
        dataArray.push({start: startH, end: endH})
    }
    console.log(dataArray)
    return dataArray;
}

const checkStartTimeInsideOpeningHours = (data: ICalculationData, start: number, end: number) => {
    console.log(openingTimes(data).find(interval => start >= interval.start && start <= interval.end))
    const intervals = openingTimes(data)

    let adjustedStart = null

    const foundIntervals = intervals.find(interval => start >= interval.start && start <= interval.end)

    if (foundIntervals) {
        adjustedStart = foundIntervals.start;
    }
    else {
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

    console.log(openingTimes(data).find(interval => start >= interval.start && start <= interval.end))
    console.log("aaaa")
    console.log([start, end])
    console.log(foundIntervals)
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
        return (data.arrivalTime === 'undefined' || 'null' ?
            [getHours(data.arrivalTime), getHours(data.arrivalTime) + 1]
            : presetGraphData[0].time)
    }
    const duration1 = () => {
        return (data.arrivalTime === 'undefined' || 'null' ?
            (getHours(data.arrivalTime) + 1 - getHours(data.arrivalTime)) + "h"
            : presetGraphData[0].duration)
    }

    const time2 = () => {
        return (data.transportTime === 'undefined' || 'null' ?
            [calculateArriveTimeEnd(data), calculateTransportTimeEnd(data)]
            : presetGraphData[1].time)
    }
    const duration2 = () => {
        return (data.transportTime === 'undefined' || 'null' ?
            (calculateTransportTimeEnd(data) - calculateArriveTimeEnd(data)) + "h"
            : presetGraphData[1].duration)
    }

    const time3 = () => {
        return (checkStartTimeInsideOpeningHours(data, calculateTransportTimeEnd(data), calculateIncubationEnd(data)))
    }


// console.log("graphCalc")
// console.log(duration1())
// console.log(calculateArriveTimeEnd(data))
// console.log(moment(data.arrivalTime, "hmm").format("HH"))


    return [
        {
            name: 'Blutkultur Entnahme',
            time: time1(),
            duration: duration1(),
        },
        {
            name: 'Transport',
            time: time2(),
            duration: duration2(),
        },
        {
            name: 'Inkubation',
            time: time3(),
            duration: 16 + "h",
        },
        {
            name: 'Gramfärbung',
            time: [32, 33],
            duration: 1 + "h",
        },
        {
            name: 'Anzucht auf Agarplatte',
            time: [33, 43],
            duration: 10 + "h",
        },
        {
            name: 'Keimart Erkennung',
            time: [56, 57],
            duration: 1 + "h",
        },
        {
            name: 'Antibiogram',
            time: [57, 63],
            duration: 6 + "h",
        },
        {
            name: 'Kommunikation Krankenhaus',
            time: [63, 64],
            duration: 1 + "h",
        },
    ]
}

export {graphDataCalculation, openingTimes}