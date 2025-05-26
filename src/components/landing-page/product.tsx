"use client"

import { CloudUpload, Grid3X3, Headphones, Music, Sparkles, Users } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Product() {
    const leftFeaturesRef = useRef<HTMLDivElement>(null);
    const rightFeaturesRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 850px)", () => {
            gsap.from(
                leftFeaturesRef.current?.children || [],
                {
                    opacity: 0,
                    xPercent: -20,
                    yPercent: -25,
                    rotate: 7.5,
                    duration: 0.75,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: rightFeaturesRef.current,
                        start: "top 65%",
                    }
                }
            );

            gsap.from(
                rightFeaturesRef.current?.children || [],
                {
                    opacity: 0,
                    xPercent: 20,
                    yPercent: -25,
                    rotate: -7.5,
                    duration: 0.75,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: rightFeaturesRef.current,
                        start: "top 65%",
                    }
                }
            );
        })
    }, []);

    return (
        <section className="w-full px-8 space-y-8 md:space-y-20">
            <div className="text-center">
                <h2 className="text-5xl font-[Deezer]">
                    Make music like a pro, <span className="text-[#a238ff]">your way</span>
                </h2>
                <p className="max-w-2xl mx-auto mt-2">
                    Tanso combines power and simplicity to let you create professional music without a steep learning curve
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div ref={leftFeaturesRef} className="flex flex-col gap-8">
                    <Feature
                        icon={<Grid3X3 size={24} />}
                        title="Intuitive pad interface"
                        description="Create rhythms and melodies with our responsive pad grid that offers a natural experience"
                    />
                    <Feature
                        icon={<Music size={24} />}
                        title="Studio-grade sound library"
                        description="Access high-quality samples and sounds to fuel your creativity"
                    />
                    <Feature
                        icon={<Users size={24} />}
                        title="Instant sharing"
                        description="Share your creations on social platforms or with other Tanso users"
                    />
                </div>
                <div ref={rightFeaturesRef} className="flex flex-col gap-8">
                    <Feature
                        icon={<CloudUpload size={24} />}
                        title="Cloud sound library"
                        description="Save your personal sound library securely in the cloud and access it anywhere"
                    />
                    <Feature
                        icon={<Headphones size={24} />}
                        title="Built-in sound effects"
                        description="Add effects to your sounds directly in the app for instant creative control"
                    />
                    <Feature
                        icon={<Sparkles size={24} />}
                        title="Beginner-friendly workflow"
                        description="Enjoy a streamlined workflow designed to help beginners start making music fast"
                    />
                </div>
            </div>
        </section >
    )
}

function Feature({ ...props }: { icon: React.ReactNode; title: string; description: string; }) {
    return (
        <div className="flex flex-col p-4 rounded-[1rem] bg-purple-100/40 h-fit">
            <div className="flex gap-3 items-center">
                <div className="bg-purple-400/30 min-h-8 min-w-8 flex items-center justify-center rounded text-purple-400">
                    {props.icon}
                </div>
                <h3 className="leading-none text-lg font-bold">{props.title}</h3>
            </div>
            <p className="text-sm mt-3 text-semibold">{props.description}</p>
        </div>
    );
}