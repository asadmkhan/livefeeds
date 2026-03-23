type ToolbarProps = {
  count: number;
  sort: string;
  sortTypes: string[];
  onSort: (sort: string) => void;
};

export default function Toolbar({
  count,
  sort,
  sortTypes,
  onSort,
}: ToolbarProps) {
  return (
    <div className="bg-white flex items-center justify-between px-4 py-2 shrink-0 border-b border-gray-200">
      <span className="font-medium text-gray-900">{count} Feeds</span>

      <div className="flex flex-wrap gap-2">
        {sortTypes.map((sortType) => (
          <button
            key={sortType}
            className={`text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap
                ${sort === sortType ? "bg-amber-600" : "bg-indigo-500"}
                    `}
            onClick={() => onSort(sortType)}
          >
            {sortType}
          </button>
        ))}
      </div>
    </div>
  );
}
