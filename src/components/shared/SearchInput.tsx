import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative flex items-center", containerClassName)}>
      <Search className="absolute left-3 w-4 h-4 text-gray-400" />
      <input
        {...props}
        className={cn(
          "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm",
          className
        )}
      />
    </div>
  );
}
