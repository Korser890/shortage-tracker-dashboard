interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-edge bg-surface px-2 py-0.5 text-xs font-medium text-muted ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
