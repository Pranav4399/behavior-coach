import { cn } from "@/lib/utils";
import * as React from "react";

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {}

const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "rounded-md bg-muted px-4 py-3 font-mono text-sm",
          className
        )}
        {...props}
      >
        <code>{children}</code>
      </pre>
    );
  }
);

Code.displayName = "Code";

export { Code }; 