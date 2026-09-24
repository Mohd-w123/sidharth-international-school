import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className,
  as: Comp = "div",
}: ContainerProps) {
  return (
    <Comp className={cn("mx-auto w-full max-w-[1580px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16", className)}>
      {children}
    </Comp>
  );
}
