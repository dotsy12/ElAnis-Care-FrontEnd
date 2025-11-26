import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { cva, type VariantProps } from "class-variance-authority@0.7.1";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            // 1: Pending (في انتظار القبول) - أصفر/برتقالي للانتظار
        pending: "border-transparent bg-amber-500 text-amber-50 shadow-amber-900/10",
        
        // 2: Accepted (تم قبوله) - نيلي (Commitment)
        accepted: "border-transparent bg-indigo-500 text-indigo-50 shadow-indigo-900/10",
        
        // 3: PaymentPending (في انتظار الدفع) - برتقالي داكن (Financial Hold)
        payment_pending: "border-transparent bg-orange-600 text-orange-50 shadow-orange-900/10",
        
        // 4: Paid (تم الدفع) - سماوي (Ready to Start)
        paid: "border-transparent bg-sky-500 text-sky-50 shadow-sky-900/10",
        
        // 5: InProgress (جاري التنفيذ) - أزرق (Active Work)
        in_progress: "border-transparent bg-blue-600 text-white shadow-blue-900/10",
        
        // 6: Completed (تم الإكمال) - أخضر (Success)
        completed: "border-transparent bg-emerald-500 text-white shadow-emerald-900/10",
        
        // 7: Cancelled (ملغي) - رمادي فاتح (Cancellation)
        cancelled: "border border-slate-300 bg-slate-100 text-slate-700",
        
        // 8: Rejected (مرفوض) - أحمر داكن (Final Failure)
        rejected: "border-transparent bg-red-700 text-white shadow-red-900/10",

        // Fallback for unknown status
        default_fallback: "border-transparent bg-gray-500 text-white",
        
  
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
