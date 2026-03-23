import type { Image } from "../types";

export function filterImages(
  images: Image[],
  selectedTags: string[],
  search: string,
  sort: string,
) {
  const filteredImages = images
    .filter(
      (img) =>
        selectedTags.length === 0 ||
        (img.Tags || []).some((t) => selectedTags.includes(t)),
    )
    .filter(
      (img) =>
        search === "" ||
        (img.Tags || []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        ) ||
        img.Title.toLowerCase().includes(search.toLowerCase()),
    );

  return sort === "Title"
    ? [...filteredImages].sort((a, b) => a.Title.localeCompare(b.Title))
    : [...filteredImages].reverse();
}
