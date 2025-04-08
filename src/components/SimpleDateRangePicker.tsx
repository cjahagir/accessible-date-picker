
import React, { useState, useRef } from "react";
import { SimpleCalendar, SimpleCalendarDateRange } from "./SimpleCalendar";
import "./SimpleDateRangePicker.css";

interface SimpleDateRangePickerProps {
  value?: SimpleCalendarDateRange;
  onChange?: (range: SimpleCalendarDateRange) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  description?: string;
}

export const SimpleDateRangePicker: React.FC<SimpleDateRangePickerProps> = ({
  value = { from: undefined, to: undefined },
  onChange,
  className = "",
  placeholder = "Select date range",
  disabled = false,
  id = "date-range-picker",
  label,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<SimpleCalendarDateRange>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Format date range for display
  const formatDateRange = (range: SimpleCalendarDateRange): string => {
    if (!range.from) return "";
    if (!range.to) return formatDate(range.from);
    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  };

  // Handle date selection from calendar
  const handleSelect = (range: SimpleCalendarDateRange) => {
    setDateRange(range);
  };

  // Handle click outside to close dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Add/remove click outside listener
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Update internal state when props change
  React.useEffect(() => {
    setDateRange(value);
  }, [value]);

  // Handle apply button click
  const handleApply = () => {
    // Only call onChange if both from and to dates are selected
    if (dateRange.from && dateRange.to) {
      onChange?.(dateRange);
      setIsOpen(false);
    } else {
      // Optionally show a message or visual feedback that a complete range is required
      const rangeInputEl = document.getElementById(id);
      if (rangeInputEl) {
        rangeInputEl.classList.add("incomplete-range");
        setTimeout(() => {
          rangeInputEl.classList.remove("incomplete-range");
        }, 500);
      }
    }
  };

  return (
    <div className={`simple-date-range-picker ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={id} className="picker-label">
          {label}
        </label>
      )}
      
      <div className="picker-container">
        <input
          id={id}
          className="picker-input"
          placeholder={placeholder}
          value={formatDateRange(dateRange)}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        
        <button
          className="calendar-toggle-button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-label="Toggle calendar"
        >
          📅
        </button>
      </div>
      
      {isOpen && (
        <div className="calendar-dropdown">
          <SimpleCalendar
            selected={dateRange}
            onSelect={handleSelect}
            disabled={disabled}
          />
          
          <div className="picker-footer">
            <button
              className="picker-cancel-button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="picker-apply-button"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
      
      {description && (
        <p className="picker-description">
          {description}
        </p>
      )}
    </div>
  );
};
