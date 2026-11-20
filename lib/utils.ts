/** Tiny dependency-free class name joiner (avoids pulling in clsx). */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}
