"use client";

import React, { forwardRef, useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-datepicker/dist/react-datepicker.css";

export interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  yearDropdownItemNumber?: number;
  showTimeSelect?: boolean;
  dateFormat?: string;
  isClearable?: boolean;
  name?: string;
  id?: string;
  portalId?: string;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  minDate,
  maxDate,
  showYearDropdown = false,
  showMonthDropdown = false,
  yearDropdownItemNumber = 15,
  showTimeSelect = false,
  dateFormat = "MMM d, yyyy",
  isClearable = true,
  name,
  id,
  portalId,
  error = false,
}: DatePickerProps) {
  // Added state for the date value so we can handle controlled input properly
  const [date, setDate] = useState<Date | null>(value || null);

  // Keep local state in sync with external value
  useEffect(() => {
    if (value !== undefined) {
      setDate(value);
    }
  }, [value]);

  // Update both the internal state and call the onChange handler
  const handleChange = (date: Date | null) => {
    setDate(date);
    onChange(date);
  };

  // Custom input component that uses our Button styling
  const CustomInput = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ value, onClick, onChange: _onChange, ...props }, ref) => (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full justify-between h-10 font-normal",
          !value && "text-muted-foreground",
          error && "border-destructive",
          className
        )}
        {...props}
      >
        {value ? (
          <span>{value as string}</span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    )
  );
  CustomInput.displayName = "DatePickerCustomInput";

  return (
    <ReactDatePicker
      selected={date}
      onChange={handleChange}
      customInput={<CustomInput />}
      dateFormat={dateFormat}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      showYearDropdown={showYearDropdown}
      showMonthDropdown={showMonthDropdown}
      yearDropdownItemNumber={yearDropdownItemNumber}
      showTimeSelect={showTimeSelect}
      isClearable={isClearable}
      portalId={portalId}
      popperClassName="z-50"
      name={name}
      id={id}
      calendarClassName="bg-background border border-border shadow-md rounded-md p-2"
      dayClassName={() => "hover:bg-muted rounded-md"}
      wrapperClassName="w-full"
      monthClassName={() => ""}
    />
  );
} 