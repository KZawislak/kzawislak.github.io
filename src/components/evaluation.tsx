import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceArea,
    LabelList,
    ResponsiveContainer, Label, ReferenceLine
} from 'recharts';
import moment from "moment/moment";

// import { ExpertModeProps } from "src/App.tsx"
// interface EvaluationProps {
//     statistic: {
//         times: { start: string; end: string; } | { start: string; end: string; }[];
//         expertModeProps: ExpertModeProps;
//     }
// }
const data = [
    {
        name: 'Blutkultur Entnahme',
        time: [0, 1],
        duration: 1,
    },
    {
        name: 'Transport ins Labor',
        time: [1, 3],
        duration: 2,
    },
    {
        name: 'Inkubations der Blutkultur',
        time: [8, 24],
        duration: 16,
    },
    {
        name: 'Bakterien Gruppieren (Gramfärbung)',
        time: [32, 33],
        duration: 1,
    },
    {
        name: 'Anzucht auf Agarplatte',
        time: [33, 43],
        duration: 10,
    },
    {
        name: 'Keimart Erkennung',
        time: [56, 57],
        duration: 1,
    },
    {
        name: 'Antibiotikum Erkennung (Antibiogram)',
        time: [57, 63],
        duration: 6,
    },
    {
        name: 'Kommunikation Krankenhaus',
        time: [63, 64],
        duration: 1,
    },
];

/*
TODO: get berechnungsmodell passed
 */
// const processTimeData = () => {
/*
for processStep in datafile
    for interval in TimeInterval

        if (inside a timeInterval)
            skip

        if processstep.starttime > interval.endtime && interval.starttime < interval-

 */

// }

/*
Returns the start and endtimes in terms of hours in an array given a set start and endtime.
 */
const openingTimesData = (starttime: number, endtime: number) => {
    const data = []
    for (let day = 0; day < 5; day++) {
        const start = starttime + day * 24;
        const end = endtime + day * 24;

        data.push({start: start, end: end})
    }
    return data;
}

export default function Evaluation() {

    const openingTimes = openingTimesData(8, 18);
    const formatXAxis = (tick: number) => {
        const hourOfDay = tick % 24;
        // const day = Math.floor(tick / 24) + 1;
        return moment().startOf('day').add(hourOfDay, 'hours').format('HH:mm');
    };

    return (
        <div className="flex justify-center">
            <ResponsiveContainer
                // className="min-h-80 md:min-h-full"
                width={'90%'}
                height={500}
            >
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{top: 5, right: 30, left: 60, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis type="number"
                           domain={[0, 24 * 3]}
                           tickCount={24 * 3}
                           tickFormatter={formatXAxis}
                           interval={0}
                           angle={45}
                           dx={15}
                           dy={20}
                           minTickGap={-500}
                           height={100}
                    >
                        <Label value="Time" position="insideBottom" offset={0}/>
                    </XAxis>
                    <YAxis type="category" dataKey="name">
                        <Label value="Process Steps" angle={-90} position="insideLeft" offset={-50}/>
                    </YAxis>
                    <Tooltip/>
                    <ReferenceLine x="24" stroke="red" label={{position: 'top',  value: 'Tag 1', fill: 'red', fontSize: 14 }} strokeWidth={3}/>
                    <ReferenceLine x="48" stroke="red" label={{position: 'top',  value: 'Tag 2', fill: 'red', fontSize: 14 }} strokeWidth={3}/>
                    <ReferenceLine x="72" stroke="red" label={{position: 'top',  value: 'Tag 3', fill: 'red', fontSize: 14 }} strokeWidth={3}/>
                    <Legend verticalAlign="top"/>
                    {openingTimes.map((interval, index) => (
                        <ReferenceArea key={index} x1={interval.start} x2={interval.end} fill="white">
                            <Label value="Öffnungszeiten" position="bottom" />
                        </ReferenceArea>
                    ))}
                    <Bar name="Dauer des Prozesses" dataKey="time" fill="#82ca9d" barSize={25} >
                        <LabelList dataKey="name" position="right" fill="white" />
                        <LabelList dataKey="duration" position="end" fill="white" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}