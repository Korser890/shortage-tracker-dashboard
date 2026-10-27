interface SectionNoteProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * One short line of plain-English explanation, sitting under a card heading.
 * Deliberately recessive: this must never compete with the data it describes.
 */
export function SectionNote({ children, className }: SectionNoteProps) {
  return (
    <p className={`text-xs leading-relaxed text-muted/75 ${className ?? ''}`}>
      {children}
    </p>
  );
}
