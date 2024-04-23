import {Label} from "@/components/ui/label.tsx";
import TimePicker from "@/components/timepicker.tsx";
import {ICalculationData} from "@/types/Data.ts";

interface SingleDayProps {
    onTimePickerChange: (start: string, end: string) => void,
    data: ICalculationData
}

export default function SingleDay({ onTimePickerChange, data }: Readonly<SingleDayProps>) {

    return <>
        <Label> Öffnungszeiten sind an allen Tagen gleich!</Label>
        <TimePicker onChange={onTimePickerChange} data={data} index={10}/>
    </>;
}