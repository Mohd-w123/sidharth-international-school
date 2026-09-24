import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const headingVariants = cva("font-heading font-bold tracking-tight", {
  variants: {
    level: {
      1: "text-4xl md:text-5xl lg:text-6xl",
      2: "text-3xl md:text-4xl lg:text-5xl",
      3: "text-2xl md:text-3xl",
      4: "text-xl md:text-2xl",
      5: "text-lg md:text-xl",
      6: "text-base md:text-lg",
    },
  },
  defaultVariants: {
    level: 2,
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({
  as,
  level = 2,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = as ?? (`h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props}>
      {children}
    </Tag>
  );
}

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      lead: "text-lg text-muted-foreground md:text-xl",
      small: "text-sm text-muted-foreground",
      large: "text-lg font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
}

export function Text({
  as: Comp = "p",
  variant,
  className,
  ...props
}: TextProps) {
  return (
    <Comp className={cn(textVariants({ variant }), className)} {...props} />
  );
}

interface SectionTitleProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-10 space-y-3 md:mb-14",
        align === "center" && "mx-auto max-w-3xl text-center",
        className
      )}
    >
      {label && (
        <span className="inline-block text-sm font-semibold uppercase tracking-widest text-accent">
          {label}
        </span>
      )}
      <Heading level={2}>{title}</Heading>
      {description && <Text variant="lead">{description}</Text>}
    </div>
  );
}
