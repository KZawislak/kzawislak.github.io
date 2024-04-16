import {Label} from "@/components/ui/label.tsx";
import TimePicker from "@/components/timepicker.tsx";

interface SingleDayProps {
    onTimePickerChange: (start: string, end: string) => void;
}

export default function SingleDay({onTimePickerChange}: Readonly<SingleDayProps>) {

    return <>
        <Label> Öffnungszeiten sind an allen Tagen gleich!</Label>
        <TimePicker onChange={onTimePickerChange}/>
    </>;
}