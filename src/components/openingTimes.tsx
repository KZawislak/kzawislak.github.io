import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import MultiDay from "@/components/multiDay.tsx";
import SingleDay from "@/components/singleDay.tsx";
import {ICalculationData} from "@/types/Data.ts";


interface OpeningTimesProps {
    multiDayMode: boolean,
    setMultiDayMode: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    expertMode: boolean,
    setExpertMode: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    handleMultiDayChange: (index: number, startTime: string, endTime: string) => void,
    handleSingleDayChange: (start: string, end: string) => void,
    allDayMode: boolean,
    setAllDayMode: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data: ICalculationData
}

export default function OpeningTimes({
                                         multiDayMode,
                                         setMultiDayMode,
                                         handleMultiDayChange,
                                         handleSingleDayChange,
                                         allDayMode,
                                         setAllDayMode,
                                         data,
                                     }: OpeningTimesProps) {
    return (
        <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
            <Card className="bg-auto">
                <CardHeader>
                    <CardTitle>Öffnungszeiten</CardTitle>
                    <CardDescription>
                        Gebe die Öffnungszeiten Ihres Labors ein!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                        <div className="flex items-center space-x-2">
                            <Switch id="all-day-mode" checked={allDayMode}
                                    onCheckedChange={setAllDayMode}/>
                            <Label htmlFor="all-day-mode">24/7 Labor</Label>
                            {allDayMode ? null : (<>
                                <Switch id="multi-day-mode" checked={multiDayMode}
                                                            onCheckedChange={setMultiDayMode}/>
                                <Label htmlFor="multi-day-mode">Einzelne Wochentage bearbeiten!</Label>
                            </>)}
                        </div>
                        <Separator/>
                        {/*todo: übergebe werte aus const als values*/}
                        {/*todo: antd TimePicker.RangePicker */}
                        {allDayMode ? null : multiDayMode ? <MultiDay onTimePickerChange={handleMultiDayChange} data={data}/> :
                            <SingleDay onTimePickerChange={handleSingleDayChange} data={data}/>}
                    </div>
                </CardContent>
                {/*<CardFooter className="border-t px-6 py-4">*/}
                {/*    <Button >Save</Button>*/}
                {/*</CardFooter>*/}
            </Card>
        </div>
    )
}