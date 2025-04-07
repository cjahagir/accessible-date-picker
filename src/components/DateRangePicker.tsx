import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { addMonths, format, setMonth, setYear, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { YearMonthSelector } from "./YearMonthSelector";
import { 
  DateRange, 
  dateRangeToString, 
  isDateDisabled, 
  parseDateRange 
} from "@/lib/date-utils";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
  calendarClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  labelClassName?: string;
  description?: string;
  descriptionClassName?: string;
}

export function DateRangePicker({
  value = { from: undefined, to: undefined },
  onChange,
  className,
  calendarClassName,
  placeholder = "Select date range",
  disabled = false,
  id = "date-range-picker",
  label,
  labelClassName,
  description,
  descriptionClassName,
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange>(value);
  const [tempDate, setTempDate] = useState<DateRange>(value);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(dateRangeToString(value));
  const [lastValidInput, setLastValidInput] = useState<string>(dateRangeToString(value));
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDate(value);
    setTempDate(value);
    setInputValue(dateRangeToString(value));
    setLastValidInput(dateRangeToString(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    try {
      const newRange = parseDateRange(newValue);
      
      if (newRange.from) {
        setTempDate(newRange);
        setLastValidInput(newValue);
        
        setCalendarDate(newRange.from);
      }
    } catch (error) {
      console.log("Invalid date format");
    }
  };

  const handleInputBlur = () => {
    if (inputValue !== lastValidInput) {
      setInputValue(lastValidInput);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setInputValue(lastValidInput);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      
      setTimeout(() => {
        calendarRef.current?.focus();
      }, 100);
    }
  };

  const handlePreviousMonth = () => {
    setCalendarDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(prevDate => addMonths(prevDate, 1));
  };

  const handleYearMonthSelect = (month: number, year: number) => {
    const newDate = setYear(setMonth(calendarDate, month), year);
    setCalendarDate(newDate);
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      setTempDate(prevTempDate => {
        if (range.from && !range.to && prevTempDate.to) {
          return { from: range.from, to: undefined };
        }
        return range;
      });
    }
  };

  const handleSave = () => {
    setDate(tempDate);
    
    const formattedRange = dateRangeToString(tempDate);
    setInputValue(formattedRange);
    setLastValidInput(formattedRange);
    
    onChange?.(tempDate);
    
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setTempDate(date);
      
      if (!date.from) {
        setCalendarDate(new Date());
      } else {
        setCalendarDate(date.from);
      }
    }
  }, [isOpen, date]);

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label 
          htmlFor={id} 
          className={cn("block text-sm font-medium", labelClassName)}
        >
          {label}
        </label>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative">
          <Input
            id={id}
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="date-picker-input pr-10"
            disabled={disabled}
            aria-label={label || "Date range"}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
          />
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </div>
        
        <PopoverContent 
          className={cn("w-auto p-0 glass-morphism animate-slide-in", calendarClassName)} 
          align="start"
        >
          <div 
            ref={calendarRef} 
            className="flex flex-col p-3 outline-none" 
            tabIndex={-1}
            onKeyDown={handleCalendarKeyDown}
          >
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreviousMonth}
                className="date-picker-transition"
                aria-label="Previous month"
              >
                Previous
              </Button>
              
              <YearMonthSelector
                month={calendarDate.getMonth()}
                year={calendarDate.getFullYear()}
                onSelect={handleYearMonthSelect}
                buttonClassName="z-10"
                id="calendar-month-year-selector"
              />
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNextMonth}
                className="date-picker-transition"
                aria-label="Next month"
              >
                Next
              </Button>
            </div>
            
            <Calendar
              mode="range"
              selected={tempDate}
              onSelect={handleSelect}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              numberOfMonths={1}
              disabled={isDateDisabled}
              className="p-0 pointer-events-auto"
              classNames={{
                day: "calendar-day date-picker-transition focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-ring",
                day_range_start: "calendar-day-range-from",
                day_range_end: "calendar-day-range-to", 
                day_range_middle: "calendar-day-range",
                nav: "hidden",
                nav_button: "hidden",
                table: "w-full border-collapse space-y-1 focus-within:outline-none",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              }}
              showOutsideDays={false}
              fixedWeeks
              enableTabNavigation={true}
              initialFocus
            />
            
            <div className="flex justify-end gap-2 mt-4 border-t border-border pt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {description && (
        <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
