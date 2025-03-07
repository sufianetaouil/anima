"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface Employer {
  id: string;
  businessName: string;
}

interface EmployerComboboxProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmployerCombobox({
  value,
  onChange,
  error,
}: EmployerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    async function fetchEmployers() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/employers/search?q=${encodeURIComponent(debouncedSearch)}`
        );
        if (!response.ok) throw new Error("Failed to fetch employers");
        const data = await response.json();
        setEmployers(data);
      } catch (error) {
        console.error("Error fetching employers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployers();
  }, [debouncedSearch]);

  const selectedEmployer = employers.find((employer) => employer.id === value);

  return (
    <div className="relative">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search employers..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm",
            error && "border-red-500"
          )}
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute right-0 top-0 flex h-full items-center justify-center px-2"
        >
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </button>
      </div>
      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
          {loading ? (
            <div className="px-2 py-2 text-sm text-gray-500">Loading...</div>
          ) : employers.length === 0 ? (
            <div className="px-2 py-2 text-sm text-gray-500">No employers found</div>
          ) : (
            employers.map((employer) => (
              <div
                key={employer.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100",
                  value === employer.id && "bg-gray-100"
                )}
                onClick={() => {
                  onChange(employer.id);
                  setInputValue(employer.businessName);
                  setOpen(false);
                }}
              >
                {employer.businessName}
                {value === employer.id && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            ))
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {selectedEmployer && (
        <input type="hidden" name="employerId" value={selectedEmployer.id} />
      )}
    </div>
  );
} 