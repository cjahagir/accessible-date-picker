
import { useState } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "@/lib/date-utils";
import { format } from "date-fns";

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
    console.log("Date range changed:", range);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md mx-auto space-y-12">
        <div className="space-y-2 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
            Accessible Date Picker
          </div>
          <h1 className="text-3xl font-medium tracking-tight">
            Select a Date Range
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            A beautiful, accessible date range picker with keyboard navigation and manual input support.
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-morphism rounded-xl p-6 shadow-sm">
            <div className="space-y-1 mb-6">
              <h2 className="text-lg font-medium">Date Selection</h2>
              <p className="text-sm text-muted-foreground">
                Choose dates by typing or using the calendar.
              </p>
            </div>

            <DateRangePicker
              value={dateRange}
              onChange={handleDateChange}
              label="Select date range"
              description="Tip: You can type dates manually (MM/DD/YYYY format) or use arrow keys to navigate."
              calendarClassName="w-auto"
            />

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium mb-2">Selected Range</h3>
              <div className="bg-secondary/50 rounded-lg p-4 text-sm">
                {dateRange.from ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">
                        {format(dateRange.from, "MMMM d, yyyy")}
                      </span>
                    </div>
                    {dateRange.to && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">
                          {format(dateRange.to, "MMMM d, yyyy")}
                        </span>
                      </div>
                    )}
                    {dateRange.from && dateRange.to && (
                      <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">
                          {Math.ceil(
                            (dateRange.to.getTime() - dateRange.from.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1}{" "}
                          days
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-2">
                    No dates selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="glass-morphism rounded-xl p-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-medium">Keyboard Controls</h2>
              <p className="text-sm text-muted-foreground">
                Full keyboard navigation for accessibility.
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="inline-block px-2 py-0.5 bg-secondary rounded text-xs font-mono mt-0.5">
                  Tab
                </span>
                <span>Navigate between interactive elements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block px-2 py-0.5 bg-secondary rounded text-xs font-mono mt-0.5">
                  Space/Enter
                </span>
                <span>Select a date or open the calendar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block px-2 py-0.5 bg-secondary rounded text-xs font-mono mt-0.5">
                  Arrow Keys
                </span>
                <span>Navigate between dates in the calendar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block px-2 py-0.5 bg-secondary rounded text-xs font-mono mt-0.5">
                  Escape
                </span>
                <span>Close the calendar or cancel input</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          A minimalist, accessible date picker inspired by modern design principles.
        </div>
      </div>
    </div>
  );
};

export default Index;
