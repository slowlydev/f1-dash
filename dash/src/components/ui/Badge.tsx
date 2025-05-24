import clsx from "clsx"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "docs"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  // Simple mapping of variants to class names
  const variantClasses = {
    default: "border-transparent bg-blue-700 text-white hover:bg-blue-600",
    secondary: "border-transparent bg-emerald-800 text-white hover:bg-emerald-700",
    destructive: "border-transparent bg-red-800 text-white hover:bg-red-700",
    outline: "text-white border-zinc-700",
    docs: "border-transparent bg-purple-800 text-white hover:bg-purple-700",
  }

  // Base classes that apply to all badges
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"

  return <div className={clsx(baseClasses, variantClasses[variant], className)} {...props} />
}

export default Badge