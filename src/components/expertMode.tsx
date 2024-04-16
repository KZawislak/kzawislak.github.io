import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React from "react";


interface ExpertModeProps {
    onExpertModePropChange: (type: string, time: string) => void;
}

//todo: standard values into a file thats read
//todo: input type="time" list attribute with 15 minute slots

const labelClasses = "font-bold text-l basis-1/4"
const divClasses = "flex items-center justify-center gap-2"
const seperatorClasses = "visible md:hidden"
export default function ExpertMode({onExpertModePropChange}: Readonly<ExpertModeProps>) {

    const handleInputTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onExpertModePropChange(e.target.id, e.target.value);
    };

    return <>
        {/*    Prozessdauer optionen + auswahl der optionen per dropdowns*/}
        <Card className="bg-auto">
            <CardHeader>
                <CardTitle>Dauer der einzelnen Prozessschritte</CardTitle>
                <CardDescription>
                    Bearbeiten Sie die individuellen Prozessschritte Ihres Krankenhauses!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                    <div className={divClasses}>
                        <Label htmlFor="transport" className={labelClasses}>2. Transport ins Labor</Label>
                        <Input type="number" id="transport" placeholder="~ 0:30" onChange={handleInputTimeChange}/>
                    </div>
                    <Separator className={seperatorClasses}/>

                    <div className={divClasses}>
                        <Label htmlFor="incubation" className={labelClasses}>3. Inkubationszeit</Label>
                        <Input type="number" id="incubation" placeholder="~ 16:00" onChange={handleInputTimeChange}/>
                    </div>
                    <Separator className={seperatorClasses}/>

                    <div className={divClasses}>
                        <Label htmlFor="grouping" className={labelClasses}>5. Bakterien Gruppieren (Gram
                            Präparat)</Label>
                        <Input type="number" id="grouping" placeholder="~ 1:00" onChange={handleInputTimeChange}/>
                    </div>
                    <Separator className={seperatorClasses}/>

                    <div className={divClasses}>
                        <Label htmlFor="cultivation" className={labelClasses}>6. Anzucht</Label>
                        <Input type="number" id="cultivation" placeholder="~ 6:00 - 18:00" onChange={handleInputTimeChange}/>
                    </div>
                    <Separator className={seperatorClasses}/>

                    {/*todo: placeholder/default value of input depending on select value*/}
                    <div className={divClasses}>
                        <Label htmlFor="detection" className={labelClasses}>7. Keimart Erkennung</Label>
                        <div className={"flex grow items-center justify-center gap-2"}>
                            <Select defaultValue="maldi">
                                <SelectTrigger>
                                    <SelectValue placeholder="Keimart Erkennungsmethode"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Keimart Erkennungsmethode:</SelectLabel>
                                        <SelectItem value="molecular ">Molekulare Diagnostik</SelectItem>
                                        <SelectItem value="maldi">MALDI-TOF</SelectItem>
                                        <SelectItem value="biochem">Biochemische Methode</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {/*todo: getplaceholder text, that gets selection value of props*/}
                            <Input type="number" id="detection" placeholder="~ 0:10 - 24:00" onChange={handleInputTimeChange}/>
                        </div>
                    </div>
                    <Separator className={seperatorClasses}/>

                    <div className={divClasses}>
                        <Label htmlFor="antibiotic" className={labelClasses}>8. Antibiotikum Erkennung</Label>
                        <div className={"flex grow items-center justify-center gap-2"}>
                            <Select defaultValue="ast">
                                <SelectTrigger>
                                    <SelectValue placeholder="Antibiotikum Erkennungsmethode"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Antibiotikum Erkennungsmethode:</SelectLabel>
                                        <SelectItem value="PCA ">PCA</SelectItem>
                                        <SelectItem value="id">ID</SelectItem>
                                        <SelectItem value="ast">AST</SelectItem>
                                        <SelectItem value="overnight">Über Nacht Bebrütung</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Input type="number" id="antibiotic" placeholder="~ 1:00 - 24:00" onChange={handleInputTimeChange}/>
                        </div>
                    </div>
                    <Separator className={seperatorClasses}/>

                    <div className={divClasses}>
                        <Label htmlFor="communication" className={labelClasses}>9. Kommunikation ans Krankenhaus</Label>
                        <Input type="number" id="communication" placeholder="~ 0:10" onChange={handleInputTimeChange}/>
                    </div>

                </div>
            </CardContent>
            {/*<CardFooter className="border-t px-6 py-4">*/}
            {/*    <Button >Save</Button>*/}
            {/*</CardFooter>*/}
        </Card>
    </>;
}