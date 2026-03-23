import { Search } from "lucide-react";
import { useState } from "react";

type FilterProps = {
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
};
export default function Filter({
  tags,
  selectedTags,
  onTagClick,
}: FilterProps) {
  const [tagSearch, setTagSearch] = useState<string>("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Tags
        </span>
        {selectedTags.length > 0 && (
          <button
            onClick={() => onTagClick("")}
            className="text-xs text-indigo-500"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
        <Search className="w-3 h-3 text-gray-400 shrink-0" />
        <input
          type="text"
          className="bg-transparent text-xs outline-none"
          placeholder="search tags"
          onChange={(evt) => setTagSearch(evt.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tags
          .filter(
            (t) =>
              tagSearch === "" ||
              t.toLowerCase().includes(tagSearch.toLowerCase()),
          )
          .map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-3 py-1 rounded-full text-xs border ${
                selectedTags.includes(tag)
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}
