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
                        <PadGrid />
                </PadConfigProvider>
            </SoundProvider>
        </KeyboardProvider>
    )
}