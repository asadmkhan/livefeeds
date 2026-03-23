import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("show error message", () => {
    render(<ErrorMessage msg="Upload failed" />);
    expect(screen.getByText("Upload failed")).toBeInTheDocument();
  });
});
