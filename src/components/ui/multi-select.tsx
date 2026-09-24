"use client";

import { useState, useCallback, useRef, type KeyboardEvent } from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = useCallback(
    (optionValue: string) => {
      const next = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange?.(next);
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (optionValue: string) => {
      onChange?.(value.filter((v) => v !== optionValue));
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Backspace" && value.length > 0) {
        onChange?.(value.slice(0, -1));
      }
    },
    [value, onChange]
  );

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v))
    .filter(Boolean);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map((option) => (
            <Badge
              key={option!.value}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {option!.label}
              <span
                role="button"
                tabIndex={0}
                className="rounded-sm hover:bg-muted-foreground/20"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(option!.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRemove(option!.value);
                }}
              >
                <X className="size-3" />
              </span>
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command onKeyDown={handleKeyDown}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                      value.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {value.includes(option.value) && (
                      <Check className="size-3" />
                    )}
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
