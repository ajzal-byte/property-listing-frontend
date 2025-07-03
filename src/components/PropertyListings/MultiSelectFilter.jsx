import { Check } from "lucide-react";
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
    // Check if the value is already selected
    if (value.includes(selectedValue)) {
      // If so, remove it from the array
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      // If not, add it to the array
      onChange([...value, selectedValue]);
    }
  };

  // Check if options are objects with value/label properties
  const isObjectOptions =
    options.length > 0 &&
    typeof options[0] === "object" &&
    "value" in options[0];

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
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionValue = isObjectOptions ? option.value : option;
                const optionLabel = isObjectOptions ? option.label : option;
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
            {value?.length > 0 && (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className="justify-center text-center text-xs text-muted-foreground"
                  >
                    Clear selection
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
