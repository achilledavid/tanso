"use client"

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AudioWaveform, Lightbulb, SlidersHorizontal, UploadCloud } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Workflow() {
    return (
        <section className="flex flex-col-reverse md:grid grid-cols-2 gap-8 md:gap-16 items-center px-8">
            <div className="flex gap-8 items-stretch">
                <span className="shrink-0 bg-border w-[1px] hidden md:block" />
                <ul className="flex flex-col gap-6">
                    <Step
                        index={1}
                        icon={<Lightbulb size={20} />}
                        title="Start with an idea"
                        description="Kick off your project by capturing your musical inspiration quickly and easily."
                    />
                    <Step
                        index={2}
                        icon={<SlidersHorizontal size={20} />}
                        title="Shape your sound"
                        description="Experiment with instruments, effects, and arrangements to craft your unique track."
                    />
                    <Step
                        index={3}
                        icon={<AudioWaveform size={20} />}
                        title="Play & record loops"
                        description="Play sounds with your configured pads and record loops to build your track."
                    />
                    <Step
                        index={4}
                        icon={<UploadCloud size={20} />}
                        title="Export & share"
                        description="Easily export your finished track and share it with the world."
                    />
                </ul>
            </div>
            <div className="flex items-center">
                <div>
                    <h2 className="text-5xl font-[Deezer]">
                        Simplified music creation <span className="text-[#a238ff]">workflow</span>
                    </h2>
                    <p className="mt-2">
                        Create professional-quality music in minutes.
                        Our streamlined workflow removes barriers between your ideas and finished tracks.
                    </p>
                </div>
            </div>
        </section>
    )
}

function Step({ ...props }: { icon: React.ReactNode, index: number, title: string; description: string; }) {
    return (
        <div className="relative">
            <div className="flex flex-col p-4 rounded-[1rem] border">
                <div className="flex gap-3 items-center">
                    <div className="bg-purple-400/30 min-h-8 min-w-8 flex items-center justify-center rounded text-purple-400">
                        {props.icon}
                    </div>
                    <h3 className="leading-none text-lg font-bold">{props.title}</h3>
                </div>
                <p className="text-sm mt-3 text-semibold">{props.description}</p>
            </div>
            <div
                className="absolute top-1/2 left-[-2.875rem] min-w-7 min-h-7 rounded-full items-center justify-center bg-white border leading-none hidden md:flex text-sm"
                style={{ transform: "translateY(-50%)" }}
            >
                {props.index}
            </div>
        </div>
    );
}