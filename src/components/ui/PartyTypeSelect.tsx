"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";

type PartyTypeSelectProps = {
  label: string;
  name: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  errorId?: string;
  reserveErrorSpace?: boolean;
};

export default function PartyTypeSelect({
  label,
  name,
  value,
  options,
  placeholder = "Select",
  onChange,
  onBlur,
  error,
  errorId,
  reserveErrorSpace = false,
}: PartyTypeSelectProps) {
  const baseInputClass =
    "w-full rounded-sm border border-white/10 bg-black/60 px-4 py-3 text-base text-white/80 outline-none transition focus:border-white/40 sm:text-sm";
  const errorInputClass = "border-rose-200/60 focus:border-rose-200/80";
  const errorTextClass =
    "min-h-[0.75rem] text-[0.6rem] uppercase tracking-[0.2em] text-rose-200/70 transition";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const listboxId = `${buttonId}-listbox`;
  const selectedIndex = useMemo(
    () => options.findIndex((option) => option === value),
    [options, value]
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0
  );

  const closeMenu = (shouldBlur: boolean) => {
    setOpen(false);
    if (shouldBlur) {
      onBlur?.();
    }
  };

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        closeMenu(true);
      }
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (!options.length) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((prev) => {
        const next = (prev + direction + options.length) % options.length;
        return next;
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const nextValue = options[activeIndex];
      if (nextValue) {
        onChange(nextValue);
      }
      closeMenu(true);
    }
  };

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    closeMenu(true);
  };

  const showPlaceholder = !value;
  const activeId =
    open && options[activeIndex] ? `${buttonId}-option-${activeIndex}` : undefined;

  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
      {label}
      <div
        ref={wrapperRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            closeMenu(true);
          }
        }}
        className="relative"
      >
        <input type="hidden" name={name} value={value} />
        <button
          type="button"
          id={buttonId}
          role="combobox"
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-activedescendant={activeId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          className={`${baseInputClass} ${
            error ? errorInputClass : ""
          } flex items-center justify-between gap-3`}
        >
          <span className={showPlaceholder ? "text-white/50" : "text-white/80"}>
            {showPlaceholder ? placeholder : value}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-white/70 transition ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
        <div
          role="listbox"
          id={listboxId}
          aria-labelledby={buttonId}
          className={`absolute left-0 top-full z-50 mt-2 w-full rounded-sm border border-white/10 bg-[#070708]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur transition duration-150 ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-1 opacity-0"
          } motion-reduce:transition-none`}
        >
          {options.map((option, index) => {
            const isSelected = option === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option}
                id={`${buttonId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center rounded-sm px-3 py-2 text-left text-xs uppercase tracking-[0.2em] transition ${
                  isSelected
                    ? "bg-white/12 text-white/90 shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                    : "text-white/70 hover:bg-white/8 hover:text-white/90"
                } ${isActive ? "bg-white/8 text-white/90" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      {reserveErrorSpace ? (
        <span
          id={errorId}
          aria-live="polite"
          className={`${errorTextClass} ${error ? "opacity-100" : "opacity-0"}`}
        >
          {error}
        </span>
      ) : error ? (
        <span id={errorId} aria-live="polite" className={errorTextClass}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
