import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  return (
    <div
      className={cn("rich-text max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
