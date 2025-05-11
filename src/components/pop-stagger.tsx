"use client";

import React, { PropsWithChildren } from "react";
import { useGSAP } from '@gsap/react';
import gsap from "gsap";

type TextRevealProps = {
    className?: string;
}

export default function PopStagger({ children, className }: PropsWithChildren<TextRevealProps>) {
    const sequencedChildren = React.Children.toArray(children);

    useGSAP(() => {
        gsap.from(".pop-stagger>div", {
            opacity: 0,
            scale: 0.9,
            rotation: -5,
            y: 15,
            stagger: 0.02,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
        });
    });

    return (
        <div className={`pop-stagger ${className}`}>
            {sequencedChildren.map((child, index) => (
                <div key={index} className="inline-block">
                    {child}
                </div>
            ))}
        </div>
    )
}
