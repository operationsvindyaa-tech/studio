
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {

  const CustomCaption = (props: any) => {
    const { fromDate, toDate } = useDayPicker();
    const { goToMonth, month } = useNavigation();

    if (!props.displayMonth) {
        return null;
    }

    const currentYear = new Date().getFullYear();
    const startYear = fromDate?.getFullYear() || currentYear - 100;
    const endYear = toDate?.getFullYear() || currentYear;

    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    const months = Array.from({ length: 12 }, (_, i) => i);
  
    return (
        <div className="flex justify-between items-center gap-2 mb-4">
            <Select
                onValueChange={(value) => {
                    const newDate = new Date(props.displayMonth);
                    newDate.setMonth(parseInt(value));
                    goToMonth(newDate);
                }}
                value={String(props.displayMonth.getMonth())}
            >
                <SelectTrigger className="w-[60%]">
                    <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                {months.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                       {new Date(2000, m).toLocaleString('default', { month: 'long' })}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>

             <Select
                onValueChange={(value) => {
                    const newDate = new Date(props.displayMonth);
                    newDate.setFullYear(parseInt(value));
                    goToMonth(newDate);
                }}
                value={String(props.displayMonth.getFullYear())}
                >
                <SelectTrigger className="w-[40%]">
                    <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                        {year}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
      </div>
    );
  }


  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption_start: "is-start",
        caption_between: "is-between",
        caption_end: "is-end",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // We hide the default label
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        Caption: props.captionLayout === 'dropdown-buttons' ? CustomCaption : undefined,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
