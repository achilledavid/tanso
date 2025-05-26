"use client"

import PopStagger from "@/components/pop-stagger";
import { Volume2, Zap, Award } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger)

export default function Informations() {
    const container = useRef(null)
    const ulRef = useRef(null)
    const [colorIndices, setColorIndices] = useState(Array(16).fill(0))

    useEffect(() => {
        const colors = ["bg-[#a238ff]", "bg-[#825FFF]", "bg-[#32323D]"];
        setColorIndices(
            [...Array(16)].map(() => Math.floor(Math.random() * colors.length))
        )
    }, [])

    useGSAP(() => {
        let mm = gsap.matchMedia();

        if (!container.current || !ulRef.current) return;

        mm.add("(min-width: 850px)", () => {
            ScrollTrigger.create({
                trigger: container.current,
                start: "center center",
                end: "125% top",
                pin: true,
            });

            const listItems = gsap.utils.toArray("li", ulRef.current);

            gsap.set(listItems, {
                opacity: 0,
                y: 20
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "center center",
                    end: "125% 25%",
                    scrub: true,
                }
            })
                .to(listItems, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.5,
                });
        })
    }, []);

    return (
        <section ref={container} className="flex flex-col md:grid grid-cols-2 gap-16 items-center px-8">
            <div>
                <h2 className="text-5xl font-[Deezer]">
                    Music creation <span className="text-[#a238ff]">without the complication</span>
                </h2>
                <p className="mt-2 mb-6">
                    Traditional music production is complex, expensive, and requires years of training.
                    <br />
                    Tanso changes this with an intuitive, pad-based approach.
                </p>
                <ul ref={ulRef} className="space-y-3">
                    {[
                        { icon: <Zap size={20} />, text: "Create tracks in minutes, not weeks" },
                        { icon: <Volume2 size={20} />, text: "Access thousands of professional sounds" },
                        { icon: <Award size={20} />, text: "Get studio-quality results without technical expertise" },
                    ].map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 leading-none"
                        >
                            <div className="bg-purple-400/30 min-h-8 min-w-8 flex items-center justify-center rounded text-purple-400">
                                {item.icon}
                            </div>
                            <span>{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gradient-to-br from-[#a238ff]/20 to-[#825FFF]/20 rounded-xl p-6 w-full hidden md:block">
                <PopStagger className="grid grid-cols-4 grid-rows-4 gap-3">
                    {[...Array(16)].map((_, i) => {
                        const colors = ["bg-[#a238ff]", "bg-[#825FFF]", "bg-[#32323D]"];
                        return (
                            <div
                                key={i}
                                className={`aspect-square rounded-md ${colors[colorIndices[i] || 0]} transition-all duration-200 hover:scale-105 cursor-pointer hover:shadow-lg`}
                            />
                        );
                    })}
                </PopStagger>
            </div>
        </section>
    );
}