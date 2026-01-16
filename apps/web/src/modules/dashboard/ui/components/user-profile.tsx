import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { AnimatedThemeToggler } from "@/theme/toggle-theme";

interface UserProfileProps {
    name: string;
    image?: string | null;
}

export function UserProfile({ name, image }: UserProfileProps) {
    return (
        <Badge
            variant="secondary"
            className="flex items-center gap-3 px-3 py-1.5 rounded-full"
        >
            <Avatar className="h-7 w-7">
                {image ? <AvatarImage src={image} alt={name} /> : null}
                <AvatarFallback>
                    {name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
            </Avatar>

            <span className="font-medium leading-none">{name}</span>

            <AnimatedThemeToggler />
        </Badge>
    );
}
