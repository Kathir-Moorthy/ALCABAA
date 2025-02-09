import { DarkModeContext } from "../../common/DarkModeContext";
import { useContext } from "react";

export default function Marquee() {
    const { darkMode } = useContext(DarkModeContext);

    return (
        <div className={`py-2 overflow-hidden whitespace-nowrap transition-all duration-500 ${darkMode ? "bg-gray-800 text-gray-300" : "bg-[#785533] text-white"}`}>
            {/* Marquee */}
            <marquee behavior="scroll" scrollamount="5">
                <span className="sm:text-md md:text-lg font-semibold">
                    Welcome to ALCABAA! A Lifestyle Collection, Adorned with Balance, Authenticity, and Ambition.
                </span>
            </marquee>
        </div>
    );
}