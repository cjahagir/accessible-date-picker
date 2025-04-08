import { useState } from "react";
import { SimpleDateRangePicker } from "@/components/SimpleDateRangePicker";
import { SimpleCalendarDateRange } from "@/components/SimpleCalendar";
import "./index.css";

const Index = () => {
  const [dateRange, setDateRange] = useState<SimpleCalendarDateRange>({
    from: undefined,
    to: undefined,
  });

  const handleDateChange = (range: SimpleCalendarDateRange) => {
    setDateRange(range);
    console.log("Date range changed:", range);
  };

  // Format full date
  const formatFullDate = (date: Date | undefined) => {
    if (!date) return "None";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  // Calculate duration in days
  const calculateDuration = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header">
          <div className="app-badge">Accessible Date Picker</div>
          <h1 className="app-title">Select a Date Range</h1>
          <p className="app-description">
            A simple, accessible date range picker with keyboard navigation support.
          </p>
        </div>

        <div className="app-card">
          <div className="card-header">
            <h2 className="card-title">Date Selection</h2>
            <p className="card-description">
              Choose dates using the calendar.
            </p>
          </div>

          <SimpleDateRangePicker
            value={dateRange}
            onChange={handleDateChange}
            label="Select date range"
            description="Click to select dates using the calendar"
          />

          <div className="results-section">
            <h3 className="results-title">Selected Range</h3>
            <div className="results-content">
              {dateRange.from ? (
                <div className="results-data">
                  <div className="results-row">
                    <span className="results-label">Start Date:</span>
                    <span className="results-value">
                      {formatFullDate(dateRange.from)}
                    </span>
                  </div>
                  {dateRange.to && (
                    <div className="results-row">
                      <span className="results-label">End Date:</span>
                      <span className="results-value">
                        {formatFullDate(dateRange.to)}
                      </span>
                    </div>
                  )}
                  {dateRange.from && dateRange.to && (
                    <div className="results-row results-summary">
                      <span className="results-label">Duration:</span>
                      <span className="results-value">
                        {calculateDuration()} days
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="results-empty">
                  No dates selected
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="app-card">
          <div className="card-header">
            <h2 className="card-title">Keyboard Controls</h2>
            <p className="card-description">
              Keyboard navigation for accessibility.
            </p>
          </div>

          <ul className="keyboard-shortcuts">
            <li className="shortcut-item">
              <span className="shortcut-key">Tab</span>
              <span className="shortcut-description">Navigate between interactive elements</span>
            </li>
            <li className="shortcut-item">
              <span className="shortcut-key">Space/Enter</span>
              <span className="shortcut-description">Select a date or open the calendar</span>
            </li>
            <li className="shortcut-item">
              <span className="shortcut-key">Arrow Keys</span>
              <span className="shortcut-description">Navigate between dates in the calendar</span>
            </li>
            <li className="shortcut-item">
              <span className="shortcut-key">Escape</span>
              <span className="shortcut-description">Close the calendar</span>
            </li>
          </ul>
        </div>

        <div className="app-footer">
          A minimalist, accessible date picker with simple design principles.
        </div>
      </div>
    </div>
  );
};

export default Index;
