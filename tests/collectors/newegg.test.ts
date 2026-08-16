import { describe, it, expect } from "vitest";
import { newegg } from "../../scrapers/collectors/newegg.js";

describe("newegg collector config", () => {
  it("is tagged with the correct retailer and category", () => {
    expect(newegg.retailer).toBe("newegg");
    expect(newegg.category).toBe("ram");
  });

  it("has a well-formed urls array", () => {
    expect(Array.isArray(newegg.urls)).toBe(true);
  });
});
