import {useState} from "react";
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {ThemeProvider} from "@/components/theme-provider"
import {ModeToggle} from "@/components/ui/mode-toggle.tsx";
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label.tsx";
import MultiDay from "@/components/multiDay.tsx";
import SingleDay from "@/components/singleDay.tsx";
import {Separator} from "@/components/ui/separator"
import ExpertMode from "@/components/expertMode.tsx";
import Evaluation from "@/components/evaluation.tsx";

export interface ExpertModeProps {
    [key: string]: string | string;
}

function App() {
    const [multiDayMode, setMultiDayMode] = useState(false)
    const [multiDayTimes, setMultiDayTimes] = useState<{ start: string; end: string; }[]>(new Array(7).fill({
        start: '',
        end: ''
    }));
    const [singleDayTimes, setSingleDayTimes] = useState<{ start: string, end: string }>({start: '', end: ''});
    const [expertMode, setExpertMode] = useState(false)
    const [expertModeProps, setExpertModeProps] = useState<ExpertModeProps>({});
    const [showGraph, setShowGraph] = useState(false)
    const handleMultiDayChange = (index: number, startTime: string, endTime: string) => {
        setMultiDayTimes(prevState => {
            const newTimes = [...prevState];
            newTimes[index] = {start: startTime, end: endTime};
            return newTimes;
        });
    };
    const handleSingleDayChange = (start: string, end: string) => {
        setSingleDayTimes({start, end});
    }

    const handleClick = () => {
        console.log(singleDayTimes)
        console.log(multiDayTimes)
        console.log(expertModeProps)
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

    return (
        <div className="flex min-h-screen w-full flex-col ">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-background">
                <h1 className="text-2xl grow"> Sepsis Prozess Diagnosse </h1>
                <div className="">
                    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                        <ModeToggle/>
                    </ThemeProvider>
                </div>
            </header>
            <main>
                <div className="flex flex-1 flex-col md:flex-row gap-4 p-4 md:gap-8 md:p-8">
                    <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2">
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
                                        <Switch id="multi-day-mode" checked={multiDayMode}
                                                onCheckedChange={setMultiDayMode}/>
                                        <Label htmlFor="multi-day-mode">Einzelne Wochentage bearbeiten!</Label>

                                        <Switch id="expertModeSwitch" checked={expertMode}
                                                onCheckedChange={setExpertMode}></Switch>
                                        <Label htmlFor="expertModeSwitch">Erweiterter Modus</Label>
                                    </div>
                                    <Separator/>
                                    {/*todo: übergebe werte aus const als values*/}
                                    {/*todo: antd TimePicker.RangePicker */}
                                    {multiDayMode ? <MultiDay onTimePickerChange={handleMultiDayChange}/> :
                                        <SingleDay onTimePickerChange={handleSingleDayChange}/>}
                                </div>
                            </CardContent>
                            {/*<CardFooter className="border-t px-6 py-4">*/}
                            {/*    <Button >Save</Button>*/}
                            {/*</CardFooter>*/}
                        </Card>
                    </div>
                    <div className="grid gap-4 md:gap-16 grid-cols-1 basis-1/2">
                        {expertMode ? <ExpertMode onExpertModePropChange={handleExpertModePropChange}/> : null}
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <Button className="font-bold" onClick={handleClick}>Berechnung</Button>
                    {/*    TODO: create graphs/statistics with this buttonclick*/}
                    {/*todo: validation that everything is filled out*/}
                </div>
                { showGraph ? <Evaluation statistic={getStatisticValues}/> : null}
            </main>
        </div>
    )
}

export default App
