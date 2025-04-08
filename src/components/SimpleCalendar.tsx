
import React, { useState, useEffect } from "react";
import "./SimpleCalendar.css";

export type SimpleCalendarDateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface SimpleCalendarProps {
  selected?: SimpleCalendarDateRange;
  onSelect?: (range: SimpleCalendarDateRange) => void;
  className?: string;
  disabled?: boolean;
}

export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  selected = { from: undefined, to: undefined },
  onSelect,
  className = "",
  disabled = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = useState<SimpleCalendarDateRange>(selected);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [showYearMonthSelector, setShowYearMonthSelector] = useState(false);

  useEffect(() => {
    setSelectedRange(selected);
  }, [selected]);

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Date formatting functions
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", { day: "numeric" });
  };

  // Generate calendar days for the current month
  const getDaysInMonth = (year: number, month: number): Date[] => {
    const days: Date[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Add days from previous month to fill the first week
    const firstDayOfWeek = firstDayOfMonth.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push(day);
    }
    
    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the grid
    const lastDay = days[days.length - 1];
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  // Check if a date is outside the current month
  const isOutsideMonth = (date: Date): boolean => {
    return date.getMonth() !== currentMonth.getMonth();
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date): boolean => {
    if (disabled) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Check if a date is in the selected range
  const isInRange = (date: Date): boolean => {
    if (!selectedRange.from || !selectedRange.to) return false;
    
    return (
      date.getTime() >= selectedRange.from.getTime() &&
      date.getTime() <= selectedRange.to.getTime()
    );
  };

  // Check if a date is in the hover range
  const isInHoverRange = (date: Date): boolean => {
    if (!selectedRange.from || !hoverDate) return false;
    if (selectedRange.to) return false;
    
    const start = selectedRange.from < hoverDate ? selectedRange.from : hoverDate;
    const end = selectedRange.from < hoverDate ? hoverDate : selectedRange.from;
    
    return date >= start && date <= end;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedRange(prev => {
      let newRange: SimpleCalendarDateRange;
      
      if (!prev.from) {
        newRange = { from: date, to: undefined };
      } else if (!prev.to) {
        if (date < prev.from) {
          newRange = { from: date, to: prev.from };
        } else {
          newRange = { from: prev.from, to: date };
        }
      } else {
        newRange = { from: date, to: undefined };
      }
      
      onSelect?.(newRange);
      return newRange;
    });
  };

  // Handle mouse hover for range selection
  const handleDateHover = (date: Date) => {
    if (!isDateDisabled(date)) {
      setHoverDate(date);
    }
  };

  // Generate the days for the current month view
  const calendarDays = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );

  // Days of the week labels
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Year and month selector
  const renderYearMonthSelector = () => {
    const years = Array.from({ length: 100 }, (_, i) => currentMonth.getFullYear() - 50 + i);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="year-month-selector">
        <div className="selector-header">
          <h3>Select Month and Year</h3>
          <button 
            className="selector-close-button"
            onClick={() => setShowYearMonthSelector(false)}
          >
            ×
          </button>
        </div>
        <div className="selector-content">
          <div className="month-selector">
            <h4>Month</h4>
            <div className="month-list">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`month-item ${index === currentMonth.getMonth() ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentMonth(new Date(currentMonth.getFullYear(), index, 1));
                    setShowYearMonthSelector(false);
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
          <div className="year-selector">
            <h4>Year</h4>
            <div className="year-list">
              {years.map((year) => (
                <button
                  key={year}
                  className={`year-item ${year === currentMonth.getFullYear() ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
                    setShowYearMonthSelector(false);
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`simple-calendar ${className}`}>
      <div className="calendar-header">
        <button
          className="calendar-nav-button"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <button 
          className="calendar-title"
          onClick={() => setShowYearMonthSelector(true)}
        >
          {formatMonthYear(currentMonth)}
        </button>
        <button
          className="calendar-nav-button"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
      
      {showYearMonthSelector && renderYearMonthSelector()}
      
      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays.map((date, index) => {
          const isSelected = selectedRange.from?.getTime() === date.getTime() || 
                             selectedRange.to?.getTime() === date.getTime();
          const isRangeStart = selectedRange.from?.getTime() === date.getTime();
          const isRangeEnd = selectedRange.to?.getTime() === date.getTime();
          
          return (
            <button
              key={index}
              className={`
                calendar-day
                ${isOutsideMonth(date) ? 'outside-month' : ''}
                ${isDateDisabled(date) ? 'disabled' : ''}
                ${isSelected ? 'selected' : ''}
                ${isRangeStart ? 'range-start' : ''}
                ${isRangeEnd ? 'range-end' : ''}
                ${isInRange(date) ? 'in-range' : ''}
                ${isInHoverRange(date) ? 'hover-range' : ''}
              `}
              disabled={isDateDisabled(date)}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => handleDateHover(date)}
              tabIndex={isOutsideMonth(date) || isDateDisabled(date) ? -1 : 0}
              aria-label={date.toLocaleDateString()}
              aria-selected={isSelected}
            >
              {formatDate(date)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
