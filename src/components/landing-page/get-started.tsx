import SignInButton from "../sign-in-button";

export default function GetStarted() {
    return (
        <section className="w-full px-8 text-center flex flex-col items-center">
            <h2 className="text-5xl font-[Deezer]">
                Ready to create <span className="text-[#a238ff]">your next hit ?</span>
            </h2>
            <p className="max-w-2xl mx-auto mt-2 mb-6">
                Join Tanso and start your music creation journey today!
            </p>
            <SignInButton>
                Get started for free
            </SignInButton>
        </section>
    );
}