import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Lessons, LESSONS } from "./Lessons";

describe("Lessons", () => {
  it("renders every roadmap entry", () => {
    render(<Lessons />);
    for (const l of LESSONS) {
      expect(screen.getByText(l.tag)).toBeInTheDocument();
      expect(screen.getByText(l.title)).toBeInTheDocument();
    }
  });

  it("has exactly 11 lessons (lesson-00 through lesson-10)", () => {
    expect(LESSONS).toHaveLength(11);
    expect(LESSONS[0].tag).toBe("lesson-00");
    expect(LESSONS[LESSONS.length - 1].tag).toBe("lesson-10");
  });

  it("marks lesson-01 as done", () => {
    const l = LESSONS.find((x) => x.tag === "lesson-01");
    expect(l?.status).toBe("done");
  });
});
