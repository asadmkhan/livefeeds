import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Feed from "../components/Feed";
import type { Image } from "../types";

const testImages: Image[] = [
  {
    ID: "1",
    Title: "Sea View",
    URL: "https://picsum.photos/id/16/800/450",
    Tags: ["nature"],
  },
  {
    ID: "2",
    Title: "City Bridge",
    URL: "https://picsum.photos/id/84/800/450",
    Tags: ["city"],
  },
];

describe("Feed component", () => {
  it("renders the correct number of images", () => {
    render(<Feed images={testImages} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(2);
  });

  it("shows image titles", () => {
    render(<Feed images={testImages} />);
    expect(screen.getByText("Sea View")).toBeInTheDocument();
    expect(screen.getByText("City Bridge")).toBeInTheDocument();
  });
});
