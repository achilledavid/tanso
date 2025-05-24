import { Fragment } from 'react';
import style from './Herobanner.module.scss';
import SignInButton from '@/components/sign-in-button';
import TextReveal from '@/components/text-reveal/text-reveal';

export default function Herobanner() {
    return (
        <div className={style.herobanner}>
            <TextReveal>
                <Fragment>Bring</Fragment>
                <Fragment>your</Fragment>
                <Fragment>music</Fragment>
                <Fragment>to life</Fragment>
            </TextReveal>
            <p>Compose your music with Tanso</p>
            <SignInButton>
                Sign up for free
            </SignInButton>
        </div>
    )
}