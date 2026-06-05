interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-edge bg-card p-5 shadow-sm ${className ?? ''}`}
      {...props}
    >
      {children}
    </div>
  );
}
