"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";

type DayPickerProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames: userClassNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("calendar", className)}
        classNames={{
          months: "calendar__months",
          month: "calendar__month",
          caption: "calendar__caption",
          caption_label: "calendar__caption-label",
          nav: "calendar__nav",
          nav_button: "calendar__nav-button",
          nav_button_previous: "calendar__nav-button--prev",
          nav_button_next: "calendar__nav-button--next",
          table: "calendar__table",
          head_row: "calendar__head-row",
          head_cell: "calendar__head-cell",
          row: "calendar__row",
          cell: cn(
            "calendar__cell",
            props.mode === "range"
              ? "calendar__cell--range"
              : "calendar__cell--single",
          ),
          day: "calendar__day",
          day_range_start: "calendar__day--range-start",
          day_range_end: "calendar__day--range-end",
          day_selected: "calendar__day--selected",
          day_today: "calendar__day--today",
          day_outside: "calendar__day--outside",
          day_disabled: "calendar__day--disabled",
          day_range_middle: "calendar__day--range-middle",
          day_hidden: "calendar__day--hidden",
          ...userClassNames,
        }}
        components={{
          IconLeft: ({ className: iconClassName, ...iconProps }) => (
            <ChevronLeft
              className={cn("calendar__icon", iconClassName)}
              {...iconProps}
            />
          ),
          IconRight: ({ className: iconClassName, ...iconProps }) => (
            <ChevronRight
              className={cn("calendar__icon", iconClassName)}
              {...iconProps}
            />
          ),
        }}
        {...props}
      />

      <style jsx global>{`
        :root {
          --calendar-bg: #fff;
          --calendar-border: #e4e4e7;
          --calendar-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
          --calendar-radius: 14px;
          --calendar-text: #0f172a;
          --calendar-muted: #64748b;
          --calendar-accent: #f1f5f9;
          --calendar-primary: #fb8c00;
          --calendar-primary-text: #fff;
        }

        .calendar {
          padding: 1.25rem;
          background: var(--calendar-bg);
          border: 1px solid var(--calendar-border);
          border-radius: var(--calendar-radius);
          box-shadow: var(--calendar-shadow);
          max-width: 300px;
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
            sans-serif;
          color: var(--calendar-text);
        }

        .calendar__months {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .calendar__months {
            flex-direction: row;
          }
        }

        .calendar__month {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .calendar__caption {
          position: relative;
          display: flex;
          justify-content: center;
          padding-top: 0.5rem;
          width: 100%;
          align-items: center;
        }

        .calendar__caption-label {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .calendar__nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .calendar__nav-button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--calendar-border);
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--calendar-muted);
          transition: border-color 150ms ease, color 150ms ease,
            background 150ms ease;
          cursor: pointer;
          opacity: 0.7;
        }

        .calendar__nav-button:is(:hover, :focus-visible) {
          opacity: 1;
          color: var(--calendar-text);
          border-color: var(--calendar-text);
          background: rgba(251, 140, 0, 0.08);
        }

        .calendar__nav-button--prev {
          position: absolute;
          left: 0.25rem;
        }

        .calendar__nav-button--next {
          position: absolute;
          right: 0.25rem;
        }

        .calendar__icon {
          width: 1rem;
          height: 1rem;
        }

        .calendar__table {
          width: 100%;
          border-collapse: collapse;
        }

        .calendar__head-row,
        .calendar__row {
          display: flex;
          width: 100%;
        }

        .calendar__head-row {
          border-radius: 10px;
          overflow: hidden;
        }

        .calendar__head-cell {
          width: 32px;
          text-align: center;
          font-size: 0.78rem;
          color: var(--calendar-muted);
          font-weight: 500;
          padding: 0.4rem 0;
          border-radius: 8px;
        }

        .calendar__row {
          margin-top: 0.35rem;
        }

        .calendar__cell {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0.2rem 0;
          position: relative;
        }

        .calendar__cell--single:is(:focus-within, :hover) {
          z-index: 2;
        }

        .calendar__cell--range {
          border-radius: 8px;
        }

        .calendar__cell--range:first-child .calendar__day--selected {
          border-top-left-radius: 999px;
          border-bottom-left-radius: 999px;
        }

        .calendar__cell--range:last-child .calendar__day--selected {
          border-top-right-radius: 999px;
          border-bottom-right-radius: 999px;
        }

        .calendar__day {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: var(--calendar-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease,
            transform 120ms ease;
        }

        .calendar__day:is(:hover, :focus-visible) {
          background: rgba(148, 163, 184, 0.18);
          color: var(--calendar-text);
        }

        .calendar__day--selected {
          background: var(--calendar-primary);
          color: var(--calendar-primary-text);
          font-weight: 600;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(251, 140, 0, 0.35);
        }

        .calendar__day--range-start,
        .calendar__day--range-end {
          background: var(--calendar-primary);
          color: var(--calendar-primary-text);
        }

        .calendar__day--range-middle {
          background: var(--calendar-accent);
          color: var(--calendar-text);
          border-radius: 0;
        }

        .calendar__day--today {
          background: rgba(251, 140, 0, 0.12);
          color: var(--calendar-primary);
          font-weight: 600;
        }

        .calendar__day--outside {
          color: var(--calendar-muted);
          opacity: 0.6;
        }

        .calendar__day--disabled {
          color: var(--calendar-muted);
          opacity: 0.4;
          cursor: not-allowed;
        }

        .calendar__day--hidden {
          visibility: hidden;
        }
      `}</style>
    </>
  );
}

export { Calendar };