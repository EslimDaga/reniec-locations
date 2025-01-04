import { CheckIcon, ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface DepartmentFilterProps {
  departments: string[];
  onSelect: (department: string | null) => void;
}

const toSentenceCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function DepartmentFilter({
  departments,
  onSelect,
}: DepartmentFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback(
    (department: string | null) => {
      setSelected(department);
      onSelect(department);
      setIsOpen(false);
    },
    [onSelect]
  );

  return (
    <div className="absolute left-0 right-0 top-4 mx-4 sm:left-4 sm:right-auto md:left-1/2 md:-translate-x-1/2 z-50">
      <div className="relative w-full sm:w-[300px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group w-full h-[40px] bg-white hover:bg-[#F5F7FA] flex items-center gap-2 px-3 py-2.5 text-sm rounded-[10px] border border-[#E1E4EA] hover:border-[#F5F7FA] focus:outline-none focus:border-[#0E121B] shadow-[0px_1px_2px_0px_#0A0D1408]`}
        >
          <GlobeIcon
            className={`w-5 h-5 transition-colors ${
              selected ? "text-[#525866]" : "text-[#99A0AE]"
            } group-hover:text-[#525866]`}
          />
          <span
            className={`flex-1 text-left transition-colors ${
              selected ? "text-[#0E121B]" : "text-[#687182]"
            } group-hover:text-[#525866]`}
          >
            {selected ? toSentenceCase(selected) : "Filtrar por departamento"}
          </span>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-200 ${
              selected ? "text-[#525866]" : "text-[#99A0AE]"
            } group-hover:text-[#525866] ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute w-full mt-1 bg-white rounded-[10px] shadow-lg border border-[#E1E4EA] overflow-hidden z-30">
            <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#E1E4EA] hover:scrollbar-thumb-[#C8CCD3] scrollbar-track-transparent">
              <div className="px-1">
                <div
                  onClick={() => handleSelect(null)}
                  className="flex items-center px-3 py-2.5 text-sm hover:bg-[#F8F9FB] cursor-pointer transition-colors"
                >
                  <span className="flex-1 text-[#364152]">Todos</span>
                  {!selected && <CheckIcon className="w-4 h-4 text-blue-600" />}
                </div>
                {departments.map((dept) => (
                  <div
                    key={dept}
                    onClick={() => handleSelect(dept)}
                    className="flex items-center px-3 py-2.5 text-sm hover:bg-[#F8F9FB] cursor-pointer transition-colors"
                  >
                    <span className="flex-1 text-[#364152]">
                      {toSentenceCase(dept)}
                    </span>
                    {selected === dept && (
                      <CheckIcon className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
