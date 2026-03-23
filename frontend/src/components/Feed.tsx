import type { Image } from "../types";

type FeedProps = {
  images: Image[];
};

export default function Feed({ images }: FeedProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-4">
        {images.map((image) => (
          <div
            key={image.ID}
            className="rounded-lg overflow-hidden bg-white border border-gray-200"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={image.URL}
                alt={image.Title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-1 p-2 min-h-[75px]">
              <h2 className="text-base font-medium text-gray-900 p-1">
                {image.Title}
              </h2>
              <div className="flex flex-wrap gap-1">
                {(image.Tags || [])
                  .filter((t) => t !== "")
                  .map((t) => (
                    <span
                      key={t}
                      className="text-sm bg-gray-100 text-gray-500 p-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
