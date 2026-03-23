import { useState } from "react";
import { Feed, Filter, Upload, Toolbar, ErrorMessage } from "./components";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useImages } from "./hooks/useImages";
import { filterImages } from "./utils/filterImages";

const sortTypes = ["Latest", "Title"];

function App() {
  const { images, error } = useImages();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("Latest");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  const sortedImages = filterImages(images, selectedTags, search, sort);
  const listOfTags = [...new Set(images.flatMap((img) => img.Tags || []))];

  function handleTagClick(tag: string) {
    if (!tag) {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prv) =>
      prv.includes(tag) ? prv.filter((p) => p !== tag) : [...prv, tag],
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-5 py-3">
        <button
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setFilterOpen(true)}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-900">
          Live<span className="text-indigo-500">Feeds</span>
        </span>
        <div className="flex-1  mx-4 flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="search by title or tag"
            className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
          onClick={() => setDialogOpen(true)}
        >
          Upload
        </button>
      </header>
      <Upload isDialogOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
      <div className="flex h-[calc(100vh-53px)] overflow-hidden">
        <aside
          className={`
                fixed md:relative inset-y-0 left-0 z-30
                w-52 bg-white border-r border-gray-200 flex flex-col gap-3 p-3
                transform transition-transform duration-200
                ${filterOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
              `}
        >
          <button
            className="md:hidden self-end text-gray-400 hover:text-gray-600"
            onClick={() => setFilterOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>

          <Filter
            tags={listOfTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden p-1">
          <Toolbar
            count={sortedImages.length}
            sort={sort}
            sortTypes={sortTypes}
            onSort={setSort}
          />
          <Feed images={sortedImages} />
        </main>
      </div>

      {error && <ErrorMessage msg={error} />}
    </div>
  );
}

export default App;
