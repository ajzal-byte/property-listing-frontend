import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MultiSelectFilter({
  title,
  options,
  value,
  onChange,
  className,
}) {
  const handleSelect = (selectedValue) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  // Detect whether this is a grouped‑options array:
  const isGrouped =
    options.length > 0 &&
    typeof options[0] === "object" &&
    Array.isArray(options[0].options);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[200px] justify-start", className)}
        >
          <div className="flex items-center gap-2 flex-grow">
            <span className="truncate text-neutral-500">{title}</span>
            {value?.length > 0 && (
              <>
                <div className="h-4 w-px bg-muted-foreground/20" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {value.length}
                </Badge>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {/** If grouped, render each company as its own CommandGroup */}
            {isGrouped ? (
              options.map((group) => (
                <CommandGroup key={group.label}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {group.label}
                  </div>
                  {group.options.map((opt) => {
                    const isSelected = value.includes(opt.value);
                    return (
                      <CommandItem
                        key={opt.value}
                        onSelect={() => handleSelect(opt.value)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </div>
                        {opt.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))
            ) : (
              /** Otherwise, fall back to flat list */
              <CommandGroup>
                {options.map((option) => {
                  const optionValue = option.value ?? option;
                  const optionLabel = option.label ?? option;
                  const isSelected = value.includes(optionValue);
                  return (
                    <CommandItem
                      key={optionValue}
                      onSelect={() => handleSelect(optionValue)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{optionLabel}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {value?.length > 0 && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => onChange([])}
                  className="justify-center text-center text-xs text-muted-foreground"
                >
                  Clear selection
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
