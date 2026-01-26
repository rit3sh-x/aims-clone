import Image from "next/image";

export const CollegeInfo = () => {
    return (
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow">
            <Image
                src="/logo.png"
                alt="IIT Ropar"
                priority
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
            />
            <div className="leading-tight">
                <p className="text-sm font-semibold text-neutral-900">
                    Indian Institute of Technology Ropar
                </p>
                <p className="text-xs text-neutral-600">
                    Academic Information Management System
                </p>
            </div>
        </div>
    );
};
