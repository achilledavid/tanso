import { Volume2, Zap, Award } from "lucide-react";

export default function Informations() {
    return (

        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-[Deezer]">
                        Music creation <span className=" text-[#a238ff] font-bold">without the complication</span>
                    </h2>
                    <p className="text-secondary mb-6 text-left">
                        Traditional music production is complex, expensive, and requires years of training.
                        Tanso changes this with an intuitive, pad-based approach.
                    </p>
                    <ul className="space-y-4">
                        {[
                            { icon: <Zap size={20} />, text: "Create tracks in minutes, not weeks" },
                            { icon: <Volume2 size={20} />, text: "Access thousands of professional sounds" },
                            {
                                icon: <Award size={20} />,
                                text: "Get studio-quality results without technical expertise",
                            },
                        ].map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <div className="mt-1 bg-[#a238ff]/20 p-1 rounded text-purple-400">{item.icon}</div>
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gradient-to-br from-[#a238ff]/20 to-[#825FFF]/20 p-1 rounded-xl">
                    <div className="rounded-lg p-6">
                        <div className="grid grid-cols-4 grid-rows-4 gap-3">
                            {[...Array(16)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`aspect-square rounded-md ${[0, 5, 10, 15].includes(i)
                                        ? "bg-[#a238ff] hover:bg-[#C17AFF]"
                                        : [2, 7, 8, 13].includes(i)
                                            ? "bg-[#825FFF] hover:bg-[#9088FF]"
                                            : "bg-[#32323D] hover:bg-[#52525D]"
                                        } transition-colors`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}