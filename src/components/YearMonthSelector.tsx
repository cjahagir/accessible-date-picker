
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getMonths, getYearRange } from "@/lib/date-utils";

interface YearMonthSelectorProps {
  month: number;
  year: number;
  onSelect: (month: number, year: number) => void;
  buttonClassName?: string;
  id?: string;
}

export const YearMonthSelector = ({
  month,
  year,
  onSelect,
  buttonClassName,
  id,
}: YearMonthSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const containerRef = useRef<HTMLDivElement>(null);
  const months = getMonths();
  const years = getYearRange(new Date().getFullYear(), 50);

  const handleSelect = () => {
    onSelect(selectedMonth, selectedYear);
    setOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      handleSelect();
    }
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, [month, year]);

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <Button
        id={id}
        variant="outline"
        className={cn(
          "flex items-center justify-between w-48 text-left font-normal date-picker-transition",
          buttonClassName
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {months[selectedMonth].label} {selectedYear}
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div
          className="absolute z-50 top-full left-0 mt-1 w-64 p-3 glass-morphism rounded-lg shadow-lg animate-scale-in outline-none"
          role="dialog"
          aria-label="Select month and year"
          tabIndex={-1}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Month</h3>
              <div className="flex flex-col space-y-1 max-h-64 overflow-y-auto pr-2">
                {months.map((m) => (
                  <button
                    key={m.value}
                    className={cn(
                      "text-left px-2 py-1 rounded text-sm date-picker-transition",
                      selectedMonth === m.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    )}
                    onClick={() => setSelectedMonth(m.value)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Year</h3>
              <div className="flex flex-col space-y-1 max-h-64 overflow-y-auto pr-2">
                {years.map((y) => (
                  <button
                    key={y}
                    className={cn(
                      "text-left px-2 py-1 rounded text-sm date-picker-transition",
                      selectedYear === y
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    )}
                    onClick={() => setSelectedYear(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={handleSelect}
              className="date-picker-transition"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
