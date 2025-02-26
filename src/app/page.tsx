"use client"

import PadGrid from "@/components/PadGrid"
import { SoundProvider } from "@/contexts/SoundContext"
import { KeyboardProvider } from "@/contexts/KeyboardContext"
import { PadConfigProvider } from "@/contexts/PadConfigContext"

export default function SoundPadApp() {
    return (
        <KeyboardProvider>
            <SoundProvider>
                <PadConfigProvider>
                    <div className="container mx-auto py-8 flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-8">Pads Sonores</h1>
                        <PadGrid />
                    </div>
                </PadConfigProvider>
            </SoundProvider>
        </KeyboardProvider>
    )
}