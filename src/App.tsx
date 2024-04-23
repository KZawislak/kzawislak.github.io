import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button"
import {ThemeProvider} from "@/components/theme-provider"
import {ModeToggle} from "@/components/ui/mode-toggle.tsx";
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label.tsx";
import Evaluation from "@/components/evaluation.tsx";
import {Step, type StepItem, Stepper, useStepper,} from "@/components/ui/stepper"
import OpeningTimes from "@/components/openingTimes.tsx";
import {
    Ambulance,
    DoorOpen,
    FlaskConical,
    Hospital,
    Microscope,
    ShieldPlus,
    Tablets,
    User
} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
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
    EGermType,
    EGermTypeMethod,
    ICalculationData,
    presetGraphData,
    Weekdays
} from "@/types/Data.ts";
import {graphDataCalculation} from "@/Utils/graphDataUtils.tsx";
import ExpertMode from "@/components/expertMode.tsx";

export interface IExpertModeProps {
    [key: string]: string;
}

/**Utils */

/** Create Default Value Data*/
const createNewData = (): ICalculationData => {
    return {
        arrivalTime: "",
        arrivalDay: 0,
        transportTime: "1",
        // laboratoryHours: [{startTime: "", endTime: ""}],
        laboratoryHours: new Array(11).fill(null).map(() => ({startTime: '', endTime: ""})),
        laboratoryAllDay: false,
        laboratoryMultiDay: false,
        germType: EGermType.AVERAGE,
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
    const [expertModeProps, setExpertModeProps] = useState<IExpertModeProps>({});
    const [showGraph, setShowGraph] = useState(false)
    const [allDayMode, setAllDayMode] = useState(false)
    const [graphData, setGraphData] = useState(presetGraphData)
    // const [stepsState, setStepsState] = useState<{ label: string, icon: LucideIcon }[]>();

    useEffect(() => {
        const newData = graphDataCalculation(data)
        setGraphData(newData)
        console.log("USEFFECT")
        console.log(data)
        console.log(newData)
    }, [data])
    useEffect(() => {
        handleDataChange( (draft) => {
            draft.laboratoryAllDay = allDayMode;
            draft.laboratoryMultiDay = multiDayMode
        })
    },[allDayMode, multiDayMode])

    const handleDataChange = (fn: (draft: ICalculationData) => void): ICalculationData | undefined => {
        const modifiedData = produce(data, fn);
        setData(modifiedData);
        return modifiedData;
    };

    const handleMultiDayChange = (index: number, startTime: string, endTime: string) => {
        handleDataChange((draft) => {
            draft.laboratoryHours![index] = {startTime: startTime, endTime: endTime};
        })

        setMultiDayTimes(prevState => {
            const newTimes = [...prevState];
            newTimes[index] = {start: startTime, end: endTime};
            return newTimes;
        });
    };
    const handleSingleDayChange = (start: string, end: string) => {
        handleDataChange((draft) => {
            draft.laboratoryHours![10] = {startTime: start, endTime: end};
        })

        setSingleDayTimes({start, end});
    }

    const handleClick = () => {
        console.log(getStatisticValues)
        console.log(singleDayTimes)
        console.log(multiDayTimes)
        console.log(expertModeProps)
        console.log(data)
        console.log(graphData)
        setShowGraph(!showGraph)
    }

    const handleExpertModePropChange = (type: string, time: string) => {
        setExpertModeProps(prevState => ({
            ...prevState,
            [type]: time
        }));
    }

    const getStatisticValues = ({
        times: multiDayMode ? multiDayTimes : singleDayTimes,
        expertModeProps: expertMode ? expertModeProps : {}
    });

    // const setSteps = () => {
    const steps = [
        {label: "Ankunftszeit", icon: User},
        {label: "Transport ins Labor", icon: Ambulance},
        {label: "Labor Öffnungszeiten", icon: DoorOpen},
    ] satisfies StepItem[]

    const stepsExpert = [
        {label: "Inkubation", icon: FlaskConical, optional: true},
        {label: "Bakterien Gruppieren (Gramfärbung", icon: ShieldPlus, optional: true},
        {label: "Keimart Erkennung", icon: Microscope, optional: true},
        {label: "Antibiogram", icon: Tablets, optional: true},
        {label: "Kommunikation Krankenhaus & Verabreichung Finales Antibiotikum", icon: Hospital, optional: true},
    ] satisfies StepItem[]

    //     setStepsState( expertMode ? stepsMulti : steps)
    // }

    // const steps = [
    //     {label: "Ankunftszeit", icon: User},
    //     {label: "Transport ins Labor", icon: Ambulance},
    //     {label: "Labor Öffnungszeiten", icon: DoorOpen},
    // ] satisfies StepItem[]
    //
    // const stepsMulti = [
    //     {label: "Ankunftszeit", icon: User},
    //     {label: "Transport ins Labor", icon: Ambulance},
    //     {label: "Labor Öffnungszeiten", icon: DoorOpen},
    //     {label: "Inkubation", icon: FlaskConical, optional: true},
    //     {label: "Bakterien Gruppieren (Gramfärbung", icon: ShieldPlus, optional: true},
    //     {label: "Keimart Erkennung", icon: Microscope, optional: true},
    //     {label: "Antibiogram", icon: Tablets, optional: true},
    //     {label: "Kommunikation Krankenhaus & Verabreichung Finales Antibiotikum", icon: Hospital, optional: true},
    // ] satisfies StepItem[]

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
                    Prev
                </Button>
                <Button size="sm" onClick={nextStep} disabled={isLastStep}>
                    {isOptionalStep ? "Skip" : "Next"}
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
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-background">
                <h1 className="text-2xl grow"> Sepsis Prozess Diagnosse </h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={setDemoData} />
                    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                        <ModeToggle/>
                    </ThemeProvider>
                </div>
            </header>
            <main>
                <div className="flex flex-1 flex-col lg:flex-row gap-4 p-4 md:gap-8 md:p-8">
                    <div className="basis-1/4">
                        <div className="flex items-center my-4">
                            <Switch id="expertModeSwitch" checked={expertMode}
                                    onCheckedChange={setExpertMode}></Switch>
                            <Label htmlFor="expertModeSwitch">Erweiterter Modus</Label>
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
                                                        <Select defaultValue="monday"
                                                                value={data?.arrivalDay?.toLocaleString()}
                                                                onValueChange={(e) => {
                                                                    handleDataChange((draft) => {
                                                                        draft.arrivalDay = Object.keys(Weekdays).indexOf(e);
                                                                    })
                                                                }}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Montag"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Wochentag:</SelectLabel>
                                                                    <SelectItem value="0">Montag</SelectItem>
                                                                    <SelectItem value="1">Dienstag</SelectItem>
                                                                    <SelectItem value="2">Mittwoch</SelectItem>
                                                                    <SelectItem value="3">Donnerstag</SelectItem>
                                                                    <SelectItem value="4">Freitag</SelectItem>
                                                                    <SelectItem value="5">Samstag</SelectItem>
                                                                    <SelectItem value="6">Sontag</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input type="time" id="arrival" placeholder="~ 17:30"
                                                               value={data?.arrivalTime} className="text-right"
                                                               name="arrivalTime"
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
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>
                                            <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 min-w-96">
                                                <Card>
                                                    <CardContent className="flex items-center space-x-2 pt-6">
                                                        <Input type="number" id="transportTime" placeholder="~ 1:30"
                                                               value={data?.transportTime} className="text-right"
                                                               name="transportTime"
                                                               onChange={(e) => {
                                                                   handleDataChange((draft) => {
                                                                       draft.transportTime = e.target.value;
                                                                   })
                                                               }}
                                                        />
                                                        <Label htmlFor="arrival">Stunden</Label>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </Step>
                                    )
                                }
                                // todo: sheet?
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

                                if (index === 3) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                        </Step>
                                    )
                                }
                                if (index === 4) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                        </Step>
                                    )
                                }
                                if (index === 5) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                        </Step>
                                    )
                                }
                                if (index === 6) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                        </Step>
                                    )
                                }
                                if (index === 7) {
                                    return (
                                        <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                        </Step>
                                    )
                                }

                            })}
                            <StepButtons/>
                        </Stepper>
                        {expertMode ?
                            <>
                                <Separator/>
                                <Stepper orientation="vertical" initialStep={0}
                                    // expertMode ? stepsMulti :
                                         steps={stepsExpert}
                                         onClickStep={(step, setStep) => setStep(step)} size={"lg"}
                                         className="my-2">
                                    {stepsExpert.map((stepProps, index) => {

                                        if (index === 0) {
                                            return (
                                                <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                                </Step>
                                            );
                                        }
                                        if (index === 1) {
                                            return (
                                                <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                                </Step>
                                            );
                                        }
                                        if (index === 2) {
                                            return (
                                                <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                                </Step>
                                            );
                                        }
                                        if (index === 3) {
                                            return (
                                                <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                                </Step>
                                            );
                                        }
                                        if (index === 4) {
                                            return (
                                                <Step key={stepProps.label} {...stepProps} checkIcon={stepProps.icon}>

                                                </Step>
                                            );
                                        }

                                    })}
                                    <StepButtons/>
                                </Stepper></>
                            : null}
                    </div>

                    <Separator orientation={"vertical"}/>
                    <div className="basis-3/4 flex items-center">
                        {/*{ showGraph ? <Evaluation statistic={getStatisticValues}/> : null}*/}
                        {showGraph ?
                            <Evaluation graphData={graphData} dataV={data}/> : null
                        }
                    </div>
                </div>
                <div className="">
                    <Button className="font-bold" onClick={handleClick}>Berechnung</Button>
                    {/*    TODO: create graphs/statistics with this buttonclick*/}
                    {/*todo: validation that everything is filled out*/}
                </div>
                <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2 hidden">
                    {expertMode ?
                        <ExpertMode onExpertModePropChange={handleExpertModePropChange}/>
                        : null
                    }
                </div>
            </main>
        </div>
    )
}

export default App
