import {HTMLAttributes} from "react";

export function TypographyH1({
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
      {...props}
    >
      {children}
    </h1>
  );
}

export function TypographyLead({
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="text-muted-foreground text-xl" {...props}>
      {children}
    </p>
  );
}
