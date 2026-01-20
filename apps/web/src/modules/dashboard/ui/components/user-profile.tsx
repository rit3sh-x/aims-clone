import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { AnimatedThemeToggler } from "@/theme/toggle-theme";
import { useState } from "react";
import { ProfilePhoto } from "./profile-photo";

interface UserProfileProps {
    name: string;
    image?: string | null;
}

export function UserProfile({ name, image }: UserProfileProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [profile, setProfile] = useState<string | null | undefined>(image);

    return (
        <>
            <Badge
                variant="secondary"
                className="items-center inline-flex w-fit h-fit gap-3 px-3 py-1.5 rounded-full"
            >
                <Avatar
                    className="h-7 w-7 cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    {profile ? <AvatarImage src={profile} alt={name} /> : null}
                    <AvatarFallback>
                        {name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>

                <span className="font-medium leading-none">{name}</span>

                <AnimatedThemeToggler />
            </Badge>
            <ProfilePhoto
                open={open}
                onOpenChange={setOpen}
                setImage={setProfile}
                image={profile}
            />
        </>
    );
}
