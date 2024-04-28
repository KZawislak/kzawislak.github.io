import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label.tsx";
import ProcessGraph from "@/components/processGraph.tsx";
import {Step, type StepItem, Stepper, useStepper,} from "@/components/ui/stepper"
import OpeningTimes from "@/components/openingTimes.tsx";
import {Ambulance, DoorOpen, FlaskConical, Hospital, Microscope, ShieldPlus, Tablets, User} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {produce} from "immer"
import {
    demoData,
    EAntibioticMethod,
    EGermTypeMethod,
    ICalculationData,
    presetGraphData,
    Weekdays
} from "@/types/Data.ts";
import {graphDataCalculation} from "@/Utils/graphDataUtils.tsx";
import MyHeader from "@/components/header.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export interface IExpertModeProps {
    [key: string]: string;
}

/**Utils */

/** Create Default Value Data*/
const createNewData = (): ICalculationData => {
    return {
        arrivalTime: "15:00",
        arrivalDuration: "1",
        //TODO: default values dont take the enum properly
        arrivalDay: Weekdays.Monday,
        transportTime: "1",
        laboratoryHours: new Array(11).fill(null).map(() => ({startTime: '08:00', endTime: "16:00"})),
        laboratoryAllDay: false,
        laboratoryMultiDay: false,
        // germType: EGermType.AVERAGE,
        incubation: "16",
        germGrouping: "1",
        germTypeMethod: {type: EGermTypeMethod.MALDI, time: "1"},
        germGrow: "10",
        antibioticMethod: {type: EAntibioticMethod.AST, time: "6"},
        communicationPatient: "1",
    };
};


function App() {
    const [data, setData] = useState<ICalculationData>(
        createNewData()
    )
    const [multiDayMode, setMultiDayMode] = useState(false)
    const [multiDayTimes, setMultiDayTimes] = useState<{ start: string; end: string; }[]>(new Array(7).fill({
        start: '',
        end: ''
    }));
    const [singleDayTimes, setSingleDayTimes] = useState<{ start: string, end: string }>({start: '', end: ''});
    const [expertMode, setExpertMode] = useState(false)
    const [showGraph, setShowGraph] = useState(false)
    const [allDayMode, setAllDayMode] = useState(false)
    const [graphData, setGraphData] = useState(presetGraphData)
    // const [stepsState, setStepsState] = useState<{ label: string, icon: LucideIcon }[]>();

    useEffect(() => {
        const newData = graphDataCalculation(data)
        setGraphData(newData)
    }, [data])
    useEffect(() => {
        handleDataChange((draft) => {
            draft.laboratoryAllDay = allDayMode;
            draft.laboratoryMultiDay = multiDayMode
        })
    }, [allDayMode, multiDayMode])

    const handleDataChange = (fn: (draft: ICalculationData) => void): ICalculationData | undefined => {
        const modifiedData = produce(data, fn);
        setData(modifiedData);
        return modifiedData;
    };

    const handleMultiDayChange = (index: number, startTime: string, endTime: string) => {
        handleDataChange((draft) => {
            draft.laboratoryHours[index] = {startTime: startTime, endTime: endTime};
        })

        setMultiDayTimes(prevState => {
            const newTimes = [...prevState];
            newTimes[index] = {start: startTime, end: endTime};
            return newTimes;
        });
    };
    const handleSingleDayChange = (start: string, end: string) => {
        handleDataChange((draft) => {
            draft.laboratoryHours[10] = {startTime: start, endTime: end};
        })

        setSingleDayTimes({start, end});
    }

    const handleClick = () => {
        console.log(singleDayTimes)
        console.log(multiDayTimes)
        console.log(data)
        console.log(graphData)
        setShowGraph(!showGraph)
    }

//todo: processsteps allgemein interface similar to this
    const steps = [
        {label: "Ankunftszeit", icon: User},
        {label: "Transport ins Labor", icon: Ambulance},
        {label: "Labor Öffnungszeiten", icon: DoorOpen},
        {label: "Inkubation", icon: FlaskConical, optional:true},
        {label: "Gramfärbung", icon: ShieldPlus, optional:true},
        {label: "Keimart Erkennung", icon: Microscope, optional:true},
        {label: "Antibiogram", icon: Tablets, optional:true},
        {label: "Finale Kommunikation Krankenhaus", icon: Hospital, optional:true},
    ] satisfies StepItem[]

    const StepButtons = () => {
        const {nextStep, prevStep, isLastStep, isOptionalStep, isDisabledStep} =
            useStepper()
        return (
            <div className="w-full flex gap-2 mb-4">
                <Button
                    disabled={isDisabledStep}
                    onClick={prevStep}
                    size="sm"
                    variant="secondary"
                >
                    Zurück
                </Button>
                {/*|| (!expertMode && isOptionalStep) -> disabled Next Button whenever all Elements in the Expert Category are not shown*/}
                <Button size="sm" onClick={nextStep} disabled={isLastStep || (!expertMode && isOptionalStep)}>
                    Nächster
                </Button>
            </div>
        )
    }

    const setDemoData = () => {
        setGraphData(presetGraphData)
        setData(demoData)
    }

    return (
        <div className="flex min-h-screen w-full flex-col ">

            <MyHeader onClick={setDemoData}/>
            <main>
                <div className="flex flex-1 flex-col lg:flex-row gap-4 p-4 md:gap-2 md:p-6 items-start">
                    <div className="md:basis-1/4 bg-card rounded-xl p-4 border min-w-min max-w-xl max-h-96 md:max-h-full overflow-auto">
                        <div className="flex items-center mb-4">
                            <Switch id="expertModeSwitch" checked={expertMode}
                                    onCheckedChange={setExpertMode}></Switch>
                            <Label htmlFor="expertModeSwitch" className="pl-2">Erweiterter Modus</Label>
                        </div>

                        <Stepper orientation="vertical" initialStep={0}
                            // expertMode ? stepsMulti :
                                 steps={steps}
                                 onClickStep={(step, setStep) => setStep(step)} size={"lg"} className="my-2">
                            {steps.map((stepProps, index) => {
                                if (index === 0) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        <Select defaultValue={data.arrivalDay}
                                                                // TODO: default values of enums not working
                                                                value={data.arrivalDay}
                                                                onValueChange={(e) => {
                                                                    handleDataChange((draft) => {
                                                                        draft.arrivalDay = e as Weekdays;
                                                                    })
                                                                }}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Montag"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Wochentag:</SelectLabel>
                                                                    {Object.keys(Weekdays).map((value: string, index: number) =>
                                                                        <SelectItem key={value}
                                                                                    value={index.toString()}> {Weekdays[value as keyof typeof Weekdays]} </SelectItem>
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input type="time" id="arrival" placeholder="~ 17:30"
                                                               value={data.arrivalTime} className="text-right"
                                                               name="arrivalTime"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.arrivalTime = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="arrival">Uhr</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                if (index === 1) {
                                    return (
                                        // step component with card and cardcontent is child
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        {/*{child: props}*/}
                                                        <Input type="number" id="transportTime" placeholder="~ 1:30"
                                                               value={data.transportTime} className="text-right"
                                                               name="transportTime"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.transportTime = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="transportTime">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                // todo: sheet for infos
                                if (index === 2) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <OpeningTimes multiDayMode={multiDayMode} setMultiDayMode={setMultiDayMode}
                                                          expertMode={expertMode}
                                                          setExpertMode={setExpertMode}
                                                          handleMultiDayChange={handleMultiDayChange}
                                                          handleSingleDayChange={handleSingleDayChange}
                                                          allDayMode={allDayMode} setAllDayMode={setAllDayMode}
                                                          data={data}
                                            />
                                        </Step>
                                    )
                                }
                                //TODO: make expert mode into its own components here and make it disabled unless expert mode

                                if (index === 3 && expertMode) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        {/*{child: props}*/}
                                                        <Input type="number" id="incubationTime" placeholder="~ 1:30"
                                                               value={data.incubation} className="text-right"
                                                               name="incubationTime"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.incubation = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="incubationTime">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                if (index === 4 && expertMode) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        {/*{child: props}*/}
                                                        <Input type="number" id="germGrouping" placeholder="~ 1:30"
                                                               value={data.germGrouping} className="text-right"
                                                               name="germGrouping"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.germGrouping = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="germGrouping">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                if (index === 5 && expertMode) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>

                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        Dauer Keimwachstum
                                                        <Input type="number" id="germGrow" placeholder="~ 1:30"
                                                               value={data?.germGrow} className="text-right"
                                                               name="germGrow"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.germGrow = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="germGrow">Stunden</Label>
                                                    </CardContent>
                                                    <Separator/>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        <Select defaultValue="0"
                                                                value={data.germTypeMethod.type.toString()}
                                                                onValueChange={(e) => {
                                                                    handleDataChange((draft) => {
                                                                        draft.germTypeMethod.type = e as EGermTypeMethod;
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EGermTypeMethod)[e] == "MALDI-TOF"){
                                                                            draft.germTypeMethod.time = "0.5";
                                                                        }
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EGermTypeMethod)[e] == "Biochemische Methode"){
                                                                            draft.germTypeMethod.time = "1";
                                                                        }
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EGermTypeMethod)[e] == "Molekulare Diagnostik"){
                                                                            draft.germTypeMethod.time = "24";
                                                                        }
                                                                    })
                                                                    //change germtypemethod.time to basis value
                                                                }}>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder="Keimart Erkennungsmethode"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Keimart
                                                                        Erkennungsmethode:</SelectLabel>
                                                                    {Object.keys(EGermTypeMethod).map((value: string, index: number) =>
                                                                        <SelectItem key={value}
                                                                                    value={index.toString()}> {EGermTypeMethod[value as keyof typeof EGermTypeMethod]} </SelectItem>
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input type="number" id="germTypeMethod"
                                                               placeholder="~ 1:30"
                                                               value={data?.germTypeMethod.time}
                                                               className="text-right"
                                                               name="germTypeMethod"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.germTypeMethod.time = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="germTypeMethod">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                if (index === 6 && expertMode) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        <Select defaultValue="PCA"
                                                                value={data.antibioticMethod.type.toString()}
                                                                onValueChange={(e: string) => {
                                                                    handleDataChange((draft) => {
                                                                        draft.antibioticMethod.type = e as EAntibioticMethod;
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EAntibioticMethod)[e] == "PCA"){
                                                                            draft.antibioticMethod.time = "1";
                                                                        }
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EAntibioticMethod)[e] == "ID"){
                                                                            draft.antibioticMethod.time = "1";
                                                                        }
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EAntibioticMethod)[e] == "AST"){
                                                                            draft.antibioticMethod.time = "6";
                                                                        }
                                                                        // @ts-expect-error WIP
                                                                        if (Object.values(EAntibioticMethod)[e] == "Über Nacht Bebrütung"){
                                                                            draft.antibioticMethod.time = "16";
                                                                        }
                                                                    })
                                                                    //change germtypemethod.time to basis value
                                                                }}>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder="Antibiotikum Erkennungsmethode:"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Antibiotikum Erkennungsmethode:</SelectLabel>
                                                                    {Object.keys(EAntibioticMethod).map((value: string, index: number) =>
                                                                        <SelectItem key={value}
                                                                                    value={index.toString()}> {EAntibioticMethod[value as keyof typeof EAntibioticMethod]} </SelectItem>
                                                                    )}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input type="number" id="antibioticMethodTime"
                                                               placeholder="~ 1:30"
                                                               value={data.antibioticMethod.time} className="text-right"
                                                               name="antibioticMethodTime"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.antibioticMethod.time = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="antibioticMethodTime">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                if (index === 7 && expertMode) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        <Input type="number" id="communicationPatient"
                                                               placeholder="~ 1:30"
                                                               value={data.communicationPatient} className="text-right"
                                                               name="communicationPatient"
                                                               min="0"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.communicationPatient = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="communicationPatient">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }

                            })}
                            <StepButtons/>
                        </Stepper>
                    </div>
                    <div className="md:basis-3/4 bg-card rounded-xl p-4 border flex items-center max-w-7xl bg-card">
                        <ProcessGraph graphData={graphData} dataV={data}/>
                    </div>
                </div>
                <div className="">
                    {/*Debug button todo: delete*/}
                    <Button className="font-bold hidden" onClick={handleClick}>Berechnung</Button>
                </div>
            </main>
        </div>
    )
}

export default App
