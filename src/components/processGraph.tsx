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
import {ICalculationData, IGraphData, presetGraphDataWithWaiting, Weekdays} from "@/types/Data.ts";
import {openingTimes} from "@/Utils/graphDataUtils.tsx";

interface ProcessGraphProps {
    graphData: IGraphData[],
    dataV: ICalculationData
}

export default function ProcessGraph({graphData, dataV}: ProcessGraphProps) {

    // const openingTimes = openingTimesData(data.laboratoryHours, data.laboratoryMultiDay, data.laboratoryAllDay);
    /*
Returns the start and endtimes in terms of hours in an array given a set start and endtime.
 */

    /**  Get the last entry of the process, */
    const getEndOfProcessTime = () => {
        return graphData.slice(-1)[0].time[1]
    }


    const formatXAxis = (tick: number) => {
        const hourOfDay = tick % 24;
        return moment().startOf('day').add(hourOfDay, 'hours').format('HH:mm');
    };

    return (
        <ResponsiveContainer
            // className="overflow-x-scroll max-w-5xl"
            minWidth={600}
            // className="min-h-80 md:min-h-full"
            width={'100%'}
            height={500}
        >
            <BarChart
                // data={presetGraphDataWithWaiting}
                data={graphData}
                layout="vertical"
                margin={{top: 25, right: 30, left: 60, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis type="number"
                    // graph start at 0:
                    /*domain={["auto", "auto"]}*/
                       domain={[0, Math.ceil(getEndOfProcessTime()/24)*24]}
                    // Get the last entry of the process, round its value up to the nearest 10 and half it - to get the
                    //    needed number of ticks (Behaves simlar to "auto" in domain)
                       tickCount={Math.ceil(getEndOfProcessTime() / 10) * 10 / 2}
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
                    <Label value="Prozessschritt" angle={-90} position="insideLeft" offset={-55}/>
                </YAxis>
                {/*TODO: Tooltip teaser texte für schritte*/}
                {/*TODO: adde wochentag zum graphen*/}
                <Tooltip isAnimationActive={false}/>

                {[...Array(Math.round(getEndOfProcessTime() / 24) + 1)].map((_, i) =>
                    <ReferenceLine
                        key={"Dayline"+i}
                        x={i * 24}
                        stroke="orange"
                        label={{position: 'top', value: `Tag ${i}`, fill: 'orange', fontSize: 14}}
                        strokeWidth={3}/>
                )}
                <Legend verticalAlign="bottom" />

                {/*Creates the Highlightes OpeningTimes in our Chart*/}
                {openingTimes(dataV).map((interval, index) => (
                    <ReferenceArea key={index} x1={interval.start} x2={interval.end} fill="hsl(var(--foreground))">
                        <Label value="Öffnungszeiten" position="bottom"/>
                        <Label value={Weekdays[interval.weekday]} fill="orange" position="top" offset={10} fontSize={14}/>
                    </ReferenceArea>
                ))}
                {/*Bars with their Descriptive Labels*/}
                {/*<Bar stackId="a" dataKey="invisible" fill="transparent" barSize={100} legendType="none">*/}
                {/*    /!*<LabelList dataKey="duration" position="end" fill="hsl(var(--foreground))" overflow="hidden"/>*!/*/}
                {/*</Bar>*/}
                <Bar
                    // stackId="a"
                    name="Wartezeit" dataKey="wait" fill="red" barSize={100}/>
                <Bar
                    // stackId="a"
                    name="Dauer des Prozesses" dataKey="time" fill="#82ca9d" barSize={100} >
                    <LabelList dataKey="name" position="right" fill="hsl(var(--foreground))"
                               className="text-primary-foreground"/>
                    <LabelList dataKey="duration" position="end" fill="hsl(var(--foreground))" overflow="hidden"/>
                </Bar>


            </BarChart>
        </ResponsiveContainer>
    )
}