import { useState, type KeyboardEvent } from "react";
import { X, Upload as UploadIcon } from "lucide-react";
import { ERROR_FILE_SIZE, ERROR_UPLOAD_FAILURE } from "../constants/messages";
import ErrorMessage from "./ErrorMessage";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type UploadProps = {
  isDialogOpen: boolean;
  onClose: () => void;
};
export default function Upload({ isDialogOpen, onClose }: UploadProps) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function saveImage() {
    if (!file) return;

    setUploadError(null);

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(ERROR_FILE_SIZE);
      return;
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("title", title);
    if (tags.length > 0) {
      fd.append("tags", tags.join(","));
    } else {
      fd.append("tags", "");
    }

    fetch(`${backendUrl}/api/uploads`, {
      method: "POST",
      body: fd,
    })
      .then((res) => {
        if (!res.ok)
          return res.text().then((msg) => {
            throw new Error(msg);
          });
        setTitle("");
        setFile(null);
        setTags([]);
        onClose();
        setTagInput("");
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          setUploadError(ERROR_UPLOAD_FAILURE);
        } else {
          setUploadError(err.message);
        }
      });
  }

  function handleTagInput(evt: KeyboardEvent<HTMLInputElement>) {
    if (tagInput && evt.key === "Enter") {
      evt.preventDefault();
      const tagInputValue = tagInput.trim();
      if (!tags.includes(tagInputValue)) {
        setTags((prv) => [...prv, tagInputValue]);
        setTagInput("");
      }
    }
  }

  function removeTag(tag: string) {
    setTags((prv) => prv.filter((t) => t !== tag));
  }

  return (
    <div>
      {isDialogOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-20"
            onClick={() => {
              setUploadError(null);
              onClose();
            }}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white z-30 shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">
                Upload photo
              </span>
              <button
                onClick={() => {
                  setUploadError(null);
                  onClose();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 p-4 flex-1">
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full focus:border-indigo-400"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                id="inpFileUpload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <label
                htmlFor="inpFileUpload"
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                <UploadIcon className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Image</span>
                <span className="text-xs">{file?.name}</span>
              </label>

              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none w-full focus:border-indigo-400"
                placeholder="Enter one tag at a time press enter to add in list"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => handleTagInput(e)}
              />
              {tags.length > 0 && (
                <div className="bg-amber-100 text-xs  p-2 rounded-full">
                  {tags.map((t) => (
                    <span key={t} className="rounded-b-full font-bold p-1">
                      {t}
                      <button
                        onClick={() => removeTag(t)}
                        className="hover:text-indigo-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {uploadError && <ErrorMessage msg={uploadError} />}

            <div className="flex gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setUploadError(null);
                  onClose();
                }}
                className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveImage}
                className="flex-1 bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium"
              >
                Upload
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
