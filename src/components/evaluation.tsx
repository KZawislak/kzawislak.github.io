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
import {ICalculationData, IGraphData} from "@/types/Data.ts";
import {openingTimes} from "@/Utils/graphDataUtils.tsx";


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


interface EvaluationProps {
    graphData: IGraphData[],
    dataV: ICalculationData
}

export default function Evaluation({graphData, dataV}: EvaluationProps) {

    // const openingTimes = openingTimesData(data.laboratoryHours, data.laboratoryMultiDay, data.laboratoryAllDay);
    /*
Returns the start and endtimes in terms of hours in an array given a set start and endtime.
 */


    const formatXAxis = (tick: number) => {
        const hourOfDay = tick % 24;
        // const day = Math.floor(tick / 24) + 1;
        return moment().startOf('day').add(hourOfDay, 'hours').format('HH:mm');
    };

    return (
        // <div className="flex justify-center">
        <ResponsiveContainer
            // className="min-h-80 md:min-h-full"
            width={'100%'}
            height={'100%'}
        >
            <BarChart
                // data={Presetdata}
                data={graphData}
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
                       height={75}
                       width={80}
                       tickSize={10}
                >
                    <Label value="Time" position="insideBottom"/>
                </XAxis>
                <YAxis type="category" dataKey="name">
                    <Label value="Prozessdauer" angle={-90} position="insideLeft" offset={-50}/>
                </YAxis>
                {/*TODO: Tooltip teaser texte für schritte*/}
                {/*TODO: adde wochentag zum graphen*/}
                <Tooltip isAnimationActive={false}/>
                <ReferenceLine x="24" stroke="red" label={{position: 'top', value: 'Tag 1', fill: 'red', fontSize: 14}}
                               strokeWidth={3}/>
                <ReferenceLine x="48" stroke="red" label={{position: 'top', value: 'Tag 2', fill: 'red', fontSize: 14}}
                               strokeWidth={3}/>
                <ReferenceLine x="72" stroke="red" label={{position: 'top', value: 'Tag 3', fill: 'red', fontSize: 14}}
                               strokeWidth={3}/>
                <ReferenceLine x="96" stroke="red" label={{position: 'top', value: 'Tag 4', fill: 'red', fontSize: 14}}
                               strokeWidth={3}/>
                <ReferenceLine x="120" stroke="red" label={{position: 'top', value: 'Tag 5', fill: 'red', fontSize: 14}}
                               strokeWidth={3}/>
                <Legend verticalAlign="top"/>
                {openingTimes(dataV).map((interval, index) => (
                    <ReferenceArea key={index} x1={interval.start} x2={interval.end} fill="white" >
                        <Label value="Öffnungszeiten" position="bottom"/>
                    </ReferenceArea>
                ))}
                <Bar name="Dauer des Prozesses" dataKey="time" fill="#82ca9d" barSize={100}>
                    <LabelList dataKey="name" position="right" fill="white"/>
                    <LabelList dataKey="duration" position="end" fill="white" overflow="hidden"/>
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        // </div>
    )
}