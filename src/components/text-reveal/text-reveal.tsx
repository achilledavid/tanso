"use client";

import React, { PropsWithChildren, ElementType } from "react";
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(SplitText);
}

type TextRevealProps = {
    className?: string;
    as?: ElementType;
    onAnimationComplete?: () => void;
}

export default function TextReveal({
    children,
    className,
    as: Component = 'h1',
    onAnimationComplete
}: PropsWithChildren<TextRevealProps>) {
    useGSAP(() => {
        SplitText.create(".text-reveal", {
            type: "chars, lines",
            autoSplit: true,
            mask: "lines",
            onSplit: (self) => {
                gsap.to(".text-reveal", {
                    duration: 0,
                    opacity: 1
                });

                gsap.from(self.chars, {
                    yPercent: "random([175, 125])",
                    rotation: "random([-20, 20])",
                    stagger: {
                        amount: 0.25,
                        from: "random"
                    },
                    duration: 1,
                    ease: "power3.inOut",
                    onComplete: onAnimationComplete
                });
            }
        });
    });

    return (
        <Component className={`text-reveal opacity-0 flex flex-col ${className}`}>
            {children}
        </Component>
    )
}