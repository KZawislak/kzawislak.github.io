import TimePicker from "@/components/timepicker.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ICalculationData} from "@/types/Data.ts";

interface MultiDayProps {
    onTimePickerChange: (index: number, startTime: string, endTime: string) => void,
    data: ICalculationData
}

const labelClasses = "font-bold text-l basis-1/4"
const divClasses = "flex items-center justify-center gap-2"
const seperatorClasses = "visible md:hidden"

export default function MultiDay({ onTimePickerChange, data }: Readonly<MultiDayProps>) {
    const handleTimeChange = (index: number) => (startTime: string, endTime: string) => {
        onTimePickerChange(index, startTime, endTime);
    };
//TODO: abstrahieren in eigene componente die labeltext nimmt
    return <>
        <div className={divClasses}>
            <Label className={labelClasses}>Montag</Label>
            <TimePicker onChange={handleTimeChange(0)} data={data} index={0}/>
        </div>
        <Separator className={seperatorClasses}/>
        <div className={divClasses}>
            <Label className={labelClasses}>Dienstag</Label>
            <TimePicker onChange={handleTimeChange(1)} data={data} index={1}/>
        </div>
        <Separator className={seperatorClasses}/>
        <div className={divClasses}>
            <Label className={labelClasses}>Mittwoch</Label>
            <TimePicker onChange={handleTimeChange(2)} data={data} index={2}/>
        </div>
        <Separator className={seperatorClasses}/>
        <div className={divClasses}>
            <Label className={labelClasses}>Donnerstag</Label>
            <TimePicker onChange={handleTimeChange(3)} data={data} index={3}/>
        </div>
        <Separator className={seperatorClasses}/>
        <div className={divClasses}>
            <Label className={labelClasses}>Freitag</Label>
            <TimePicker onChange={handleTimeChange(4)} data={data} index={4}/>
        </div>
        <Separator className={seperatorClasses}/>
        <div className={divClasses}>
            <Label className={labelClasses}>Samstag</Label>
            <TimePicker onChange={handleTimeChange(5)} data={data} index={5}/>
        </div>
        <Separator className={seperatorClasses}/>
        <div className={divClasses}>
            <Label className={labelClasses}>Sonntag</Label>
            <TimePicker onChange={handleTimeChange(6)} data={data} index={6}/>
        </div>
    </>;
}