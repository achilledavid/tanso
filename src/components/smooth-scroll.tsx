"use client";

import Lenis from 'lenis';
import { Fragment } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {

    useGSAP(() => {
        const lenis = new Lenis();

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 3000);
        });

        gsap.ticker.lagSmoothing(0);
    }, []);

    return (
        <Fragment>
            {children}
        </Fragment>
    );
}