import React, { useState, useRef, useEffect } from "react";

export const DropdownMenu = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onOpenChange) onOpenChange(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        if (onOpenChange) onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onOpenChange]);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onOpenChange) onOpenChange(newState);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: toggleDropdown, isOpen });
        }
        if (child.type === DropdownMenuContent) {
          return isOpen ? React.cloneElement(child, { onClose: () => {
            setIsOpen(false);
            if (onOpenChange) onOpenChange(false);
          }}) : null;
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = React.forwardRef(({ asChild, children, onClick, isOpen, ...props }, ref) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
      'aria-expanded': isOpen,
      'aria-haspopup': true
    });
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup={true}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuContent = React.forwardRef(({ className, align = "end", children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-slate-800 p-1 text-slate-950 dark:text-slate-50 shadow-md animate-in fade-in-0 zoom-in-95 ${
      align === "end" ? "right-0" : "left-0"
    } ${className || ""}`}
    style={{ top: '100%', marginTop: '4px' }}
    {...props}
  >
    {React.Children.map(children, (child) => {
      if (child.type === DropdownMenuItem) {
        return React.cloneElement(child, { onClose });
      }
      return child;
    })}
  </div>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef(({ className, asChild, onClose, onClick, ...props }, ref) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (onClose) onClose();
  };

  const Comp = asChild ? "div" : "div";
  return (
    <Comp
      ref={ref}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ""}`}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100 ${className || ""}`}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-700 ${className || ""}`}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";