export interface ICalculationData {
    /** Time of Patient Arrival*/
    arrivalTime: string;
    arrivalDay: Weekdays;
    /** Transport of Bloodclutures to Laboratory */
    transportTime: string;
    /** Laboratory OpeningTimes */
    /**0 - 6 = Monday - Sunday | 10 = singleDay */
    laboratoryHours: IlaboratoryHours[];
    laboratoryAllDay: boolean;
    laboratoryMultiDay: boolean;

    incubation: string;

    germGrouping: string;

    germType: EGermType;
    germTypeMethod: IGermTypeMethod;

    germGrow: string;

    antibioticMethod: IAntibioticMethod;

    communicationPatient: string;
}

export interface IGermTypeMethod {
    type: EGermTypeMethod;
    time: string;
}

export  interface IAntibioticMethod {
    type: EAntibioticMethod;
    time: string;
}

export enum EGermTypeMethod {
    MOLECULAR,
    MALDI,
    BIOCHEM
}
export enum EAntibioticMethod {
    PCA,
    ID,
    AST,
    OVERNIGHT,
}

export enum EGermType {
    SHORT,
    AVERAGE,
    LONG
}

export enum Weekdays {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

export interface IlaboratoryHours {
    startTime: string,
    endTime: string
}

export interface IGraphData {
    name: string,
    time: number[],
    duration: string
}

export const presetGraphData: IGraphData[] = [
    {
        name: 'Blutkultur Entnahme',
        time: [0, 1],
        duration: 1 + "h",
    },
    {
        name: 'Transport',
        time: [1, 3],
        duration: 2 + "h",
    },
    {
        name: 'Inkubation',
        time: [8, 24],
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
];

export const demoData: ICalculationData = {
    arrivalTime: "06:00",
    arrivalDay: 1,
    transportTime: "2",
    // laboratoryHours: [{startTime: "", endTime: ""}],
    laboratoryHours: new Array(11).fill(null).map(() => ({startTime: '08:00', endTime: "16:00"})),
    laboratoryAllDay: false,
    laboratoryMultiDay: true,
    germType: EGermType.AVERAGE,
    incubation: "16",
    germGrouping: "1",
    germTypeMethod: {type: EGermTypeMethod.MALDI, time: "1"},
    germGrow: "10",
    antibioticMethod: {type: EAntibioticMethod.AST, time: "6"},
    communicationPatient: "1",
};
