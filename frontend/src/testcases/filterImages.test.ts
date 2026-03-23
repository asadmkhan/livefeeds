import { describe, it, expect } from "vitest";
import { filterImages } from "../utils/filterImages";
import type { Image } from "../types";

const testImages: Image[] = [
  {
    ID: "16",
    Title: "Sea View",
    URL: "",
    Tags: ["nature", "water", "ocean", "mountains"],
  },
  {
    ID: "20",
    Title: "City Bridge",
    URL: "",
    Tags: ["stationary", "work", "desk", "paper"],
  },
  {
    ID: "84",
    Title: "Workspace",
    URL: "",
    Tags: ["bridge", "city", "sky", "building"],
  },
];

describe("image filtering", () => {
  it("returns all images withou filter", () => {
    const result = filterImages(testImages, [], "", "Latest");
    expect(result).toHaveLength(3);
  });

  it("filters by tag", () => {
    const result = filterImages(testImages, ["nature"], "", "Latest");
    expect(result).toHaveLength(1);
    expect(result[0].Title).toBe("Sea View");
  });

  it("filters by search", () => {
    const result = filterImages(testImages, [], "sea", "Latest");
    expect(result).toHaveLength(1);
    expect(result[0].Title).toBe("Sea View");
  });
});
