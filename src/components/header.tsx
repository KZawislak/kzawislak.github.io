import {Button} from "@/components/ui/button.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {ModeToggle} from "@/components/ui/mode-toggle.tsx";

interface HeaderProps {
    onClick: () => void,
}

export default function MyHeader({ onClick }: HeaderProps) {
    return <header className="top-0 flex h-12 items-center border gap-4 px-4 md:px-6 bg-card z-1">
        <h1 className="text-2xl grow"> Sepsis Prozess Diagnosse </h1>
        <div className="flex items-center space-x-2">
            <Button className="hidden" onClick={onClick}/>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <ModeToggle/>
            </ThemeProvider>
        </div>
    </header>
}