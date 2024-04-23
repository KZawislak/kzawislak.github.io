import {Input} from "@/components/ui/input.tsx";
import React, {useState} from "react";
import {ICalculationData} from "@/types/Data.ts";

interface TimePickerProps {
    onChange: (startTime: string, endTime: string) => void,
    data: ICalculationData,
    index: number
}

const inputClasses = "text-center max-w-52"

export default function TimePicker({ onChange, data, index }: Readonly<TimePickerProps>) {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleTimeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(e.target.value);
        onChange(e.target.value, endTime);
    };
    const handleTimeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(e.target.value);
        onChange(startTime, e.target.value);
    };

    return <div className="flex gap-3 justify-center items-center md:flex-row grow">
        <h1>Von</h1>
        <Input id="universal-time-start" type="time" className={inputClasses} placeholder="7:00" value={data.laboratoryHours[index].startTime}
               onChange={handleTimeStartChange}/>
        <h1>Bis</h1>
        <Input id="universal-time-end" type="time" className={inputClasses} placeholder="15:00" value={data.laboratoryHours[index].endTime}
               onChange={handleTimeEndChange}/>
        <h1>Uhr</h1>
    </div>
}
