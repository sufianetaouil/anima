"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface Employee {
  id: string;
  memberId: string;
  name: string;
}

interface EmployeeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmployeeCombobox({
  value,
  onChange,
  error,
}: EmployeeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/employees/search?q=${encodeURIComponent(debouncedSearch)}`
        );
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, [debouncedSearch]);

  const selectedEmployee = employees.find((employee) => employee.id === value);

  return (
    <div className="relative">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search by member ID or name..."
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
          ) : employees.length === 0 ? (
            <div className="px-2 py-2 text-sm text-gray-500">No employees found</div>
          ) : (
            employees.map((employee) => (
              <div
                key={employee.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-2 py-1.5 text-sm hover:bg-gray-100",
                  value === employee.id && "bg-gray-100"
                )}
                onClick={() => {
                  onChange(employee.id);
                  setInputValue(`${employee.memberId} - ${employee.name}`);
                  setOpen(false);
                }}
              >
                <div>
                  <span className="font-medium">{employee.memberId}</span>
                  <span className="ml-2 text-gray-600">{employee.name}</span>
                </div>
                {value === employee.id && (
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
      {selectedEmployee && (
        <input type="hidden" name="employeeId" value={selectedEmployee.id} />
      )}
    </div>
  );
} 