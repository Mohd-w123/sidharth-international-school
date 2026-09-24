"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "primary" | "accent";
  padding?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const bgMap = {
  default: "bg-background",
  muted: "bg-muted/50",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent/10",
} as const;

const paddingMap = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-20 md:py-32",
} as const;

export function SectionWrapper({
  children,
  className,
  id,
  background = "default",
  padding = "lg",
  animate = true,
}: SectionWrapperProps) {
  const Wrapper = animate ? motion.section : "section";
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.5, ease: "easeOut" as const },
      }
    : {};

  return (
    <Wrapper
      id={id}
      className={cn(bgMap[background], paddingMap[padding], className)}
      {...animationProps}
    >
      {children}
    </Wrapper>
  );
}
