"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value?: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select compound components must be rendered inside a <Select>");
  }
  return ctx;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const SELECT_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  very: "Very Active",
  extreme: "Extremely Active",
  loss: "Weight Loss",
  gain: "Weight Gain",
  maintain: "Maintenance",
  muscle: "Muscle Gain",
  vegetarian: "Vegetarian",
  "non-vegetarian": "Non-Vegetarian",
  vegan: "Vegan",
  keto: "Keto",
  "high-protein": "High Protein",
};

const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : internalValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof newOpen === "function" ? newOpen(open) : newOpen;
      if (!isOpenControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [open, isOpenControlled, onOpenChange]
  );

  const handleValueChange = React.useCallback(
    (newVal: string) => {
      if (!isValueControlled) {
        setInternalValue(newVal);
      }
      onValueChange?.(newVal);
      handleOpenChange(false);
    },
    [isValueControlled, onValueChange, handleOpenChange]
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen: handleOpenChange,
        triggerRef,
      }}
    >
      <div className={cn("relative w-full", open && "z-40")}>{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, forwardedRef) => {
  const { open, setOpen, triggerRef } = useSelect();

  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    },
    [forwardedRef, triggerRef]
  );

  return (
    <button
      ref={setRefs}
      type="button"
      role="combobox"
      aria-expanded={open}
      data-state={open ? "open" : "closed"}
      onClick={() => setOpen((prev) => !prev)}
      className={cn(
        "flex h-11 w-full items-center justify-between whitespace-nowrap rounded-xl border border-input bg-card px-3.5 py-2 text-sm font-medium shadow-sm ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          open && "rotate-180 opacity-80"
        )}
      />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<{ placeholder?: string; className?: string }> = ({
  placeholder = "Select...",
  className,
}) => {
  const { value } = useSelect();
  const label = value ? SELECT_LABELS[value] || value : undefined;

  return (
    <span className={cn("truncate text-left flex-1 font-medium", !label && "text-muted-foreground", className)}>
      {label || placeholder}
    </span>
  );
};

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: string }
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useSelect();
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      role="listbox"
      className={cn(
        "absolute left-0 top-[calc(100%+6px)] z-50 max-h-60 w-full min-w-[8rem] overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, children, value, disabled = false, ...props }, ref) => {
  const { value: selectedValue, onValueChange } = useSelect();
  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      data-state={isSelected ? "checked" : "unchecked"}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onValueChange?.(value);
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        isSelected && "bg-accent/60 font-semibold text-primary",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-2.5 flex h-4 w-4 items-center justify-center text-primary">
          <Check className="h-4 w-4" />
        </span>
      )}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => <div {...props} />;
const SelectLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props} />
);
const SelectSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
);
const SelectScrollUpButton: React.FC = () => null;
const SelectScrollDownButton: React.FC = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
