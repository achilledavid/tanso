"use client";

import React, { PropsWithChildren, ElementType } from "react";
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import style from "./text-reveal.module.scss";

type TextRevealProps = {
    className?: string;
    reversed?: boolean;
    as?: ElementType;
}

export default function TextReveal({ children, className, reversed = false, as: Component = 'h1' }: PropsWithChildren<TextRevealProps>) {
    const sequencedChildren = React.Children.toArray(children);

    useGSAP(() => {
        gsap.from(`.text-reveal-${reversed} div span`, {
            y: reversed ? "-125%" : "125%",
            stagger: 0.04,
            duration: 1.25,
            ease: "power3.inOut",
        });
    });

    return (
        <Component className={`text-reveal-${reversed} ${style.container} ${className}`}>
            {sequencedChildren.map((child, index) => (
                <div className={style.item} key={index}>
                    <span>
                        {child}
                    </span>
                </div>
            ))}
        </Component>
    )
}
