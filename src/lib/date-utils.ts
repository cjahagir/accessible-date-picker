
import { addDays, format, isAfter, isBefore, isValid, parse } from "date-fns";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export const formatDate = (date: Date | undefined): string => {
  if (!date || !isValid(date)) return "";
  return format(date, "MM/dd/yyyy");
};

export const parseDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  
  const parsedDate = parse(dateStr, "MM/dd/yyyy", new Date());
  return isValid(parsedDate) ? parsedDate : undefined;
};

export const isDateDisabled = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Disable future dates
  return isAfter(date, today);
};

export const getMonthName = (month: number): string => {
  return format(new Date(2000, month, 1), "MMMM");
};

export const getYearRange = (currentYear: number, range: number = 10): number[] => {
  const years: number[] = [];
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  
  return years;
};

export const getMonths = (): { value: number; label: string }[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: getMonthName(i),
  }));
};

export const dateRangeToString = (range: DateRange): string => {
  if (!range.from) return "";
  if (!range.to) return formatDate(range.from);
  return `${formatDate(range.from)} - ${formatDate(range.to)}`;
};

export const parseDateRange = (input: string): DateRange => {
  if (!input) return { from: undefined, to: undefined };
  
  const parts = input.split("-").map(part => part.trim());
  
  if (parts.length === 1) {
    const from = parseDate(parts[0]);
    return { from, to: undefined };
  }
  
  if (parts.length === 2) {
    const from = parseDate(parts[0]);
    const to = parseDate(parts[1]);
    
    // Ensure the range is valid (from date is before to date)
    if (from && to && isAfter(from, to)) {
      return { from: to, to: from };
    }
    
    return { from, to };
  }
  
  return { from: undefined, to: undefined };
};
