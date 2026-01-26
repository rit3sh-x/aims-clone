import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import { Label } from "@workspace/ui/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId } from "react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
    range: DateRange | undefined;
    setRange: (range: DateRange | undefined) => void;
}

export const DateRangePicker = ({ range, setRange }: DateRangePickerProps) => {
    const id = useId();

    return (
        <Popover>
            <PopoverTrigger render={(triggerProps) => (
                <Button
                    {...triggerProps}
                    id={id}
                    variant={"outline"}
                    className={cn(
                        "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
                        !range && "text-muted-foreground",
                    )}
                >
                    <span className={cn("truncate", !range && "text-muted-foreground")}>
                        {range?.from ? (
                            range.to ? (
                                <>
                                    {format(range.from, "LLL dd, y")} - {format(range.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(range.from, "LLL dd, y")
                            )
                        ) : (
                            "Pick a date range"
                        )}
                    </span>
                    <CalendarIcon
                        size={16}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground w-full"
                        aria-hidden="true"
                    />
                </Button>
            )} />
            <PopoverContent className="w-full" align="center">
                <Calendar className="w-full" mode="range" selected={range} onSelect={setRange} />
            </PopoverContent>
        </Popover>
    );
}