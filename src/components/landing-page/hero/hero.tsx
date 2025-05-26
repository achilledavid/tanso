import style from './hero.module.scss';
import SignInButton from '@/components/sign-in-button';
import TextReveal from '@/components/text-reveal/text-reveal';
import { cn } from '@/lib/utils';

export default function Herobanner() {
    return (
        <section className={cn(style.container, "hero")}>
            <TextReveal>
                Bring<br />your<br />music<br /><span>to life</span>
            </TextReveal>
            <p>Compose your music with Tanso</p>
            <SignInButton>
                Sign up for free
            </SignInButton>
        </section>
    )
}