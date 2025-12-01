import * as React from "react";
import { cn } from "../../lib/utils";

interface EditableLabelProps {
  value: string;
  onChange: (value: string) => void;
  as?: React.ElementType;
  className?: string;
  editable?: boolean;
}

function EditableLabel({
  value,
  onChange,
  as: Component = "span",
  className,
  editable = false,
}: EditableLabelProps) {
  const ref = React.useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const originalValue = React.useRef(value);

  const handleClick = () => {
    if (!editable || isEditing) return;
    setIsEditing(true);
    originalValue.current = value;
  };

  React.useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const commit = () => {
    if (!ref.current) return;
    const newValue = ref.current.textContent || "";
    setIsEditing(false);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const cancel = () => {
    if (!ref.current) return;
    ref.current.textContent = originalValue.current;
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (!editable) {
    return <Component className={className}>{value}</Component>;
  }

  return (
    <Component
      ref={ref}
      className={cn(
        className,
        "transition-all duration-150",
        isEditing
          ? "border border-solid border-fuchsia-500 ring-2 ring-fuchsia-500/30 outline-none rounded px-1 -mx-1"
          : "border border-dashed border-transparent hover:border-fuchsia-400/50 hover:cursor-text rounded px-1 -mx-1"
      )}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={isEditing ? commit : undefined}
      onKeyDown={isEditing ? handleKeyDown : undefined}
    >
      {value}
    </Component>
  );
}

export { EditableLabel };
export type { EditableLabelProps };




