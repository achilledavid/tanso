import style from "./footer.module.scss"
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={style.container}>
            <div className={style.content}>
                <div className="grid md:grid-cols-4 gap-12">
                    <div>
                        <strong>Tanso</strong>
                        <p className="text-sm font-semibold">
                            Bring your music to life.<br />Compose your music with Tanso
                        </p>
                    </div>
                </div>

                <div className="border-t border-muted-foreground mt-6 pt-6 flex flex-col md:flex-row md:justify-between md:items-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Tanso. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                        <Link href="#" className="hover:underline">Terms</Link>
                        <Link href="#" className="hover:underline">Privacy</Link>
                        <Link href="#" className="hover:underline">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}