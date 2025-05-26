"use client";

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import style from './hero.module.scss';
import SignInButton from '@/components/sign-in-button';
import TextReveal from '@/components/text-reveal/text-reveal';
import { cn } from '@/lib/utils';

export default function Herobanner() {
    const containerRef = useRef(null);
    const [tl] = useState(() => gsap.timeline());
    const [revealed, setRevealed] = useState(false);

    useGSAP(() => {
        gsap.set(".hero>p, .hero>a, .hero>button", { opacity: 0, y: 20 });

        if (!revealed) return;

        tl.to(".hero>p", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
        },)
            .to(".hero>a, .hero>button", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.15,
            }, "-=0.2");

    }, { scope: containerRef, dependencies: [revealed] });

    return (
        <section className={cn(style.container, "hero")} ref={containerRef}>
            <TextReveal onAnimationComplete={() => setRevealed(true)}>
                Bring<br />your<br />music<br /><span>to life</span>
            </TextReveal>
            <p>Compose your music with Tanso</p>
            <SignInButton>
                Sign up for free
            </SignInButton>
        </section>
    )
}