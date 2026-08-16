import { describe, it, expect, vi } from "vitest";
import { normalizeRecord, normalizeBatch } from "../scrapers/lib/normalizer.js";

describe("normalizeRecord", () => {
  it("parses a dollar-formatted price string", () => {
    const result = normalizeRecord({
      url: "https://example.com/p/1",
      name: "  Test  Product  ",
      price: "$1,299.99",
      in_stock: "In Stock",
    });
    expect(result.priceCents).toBe(129999);
    expect(result.inStock).toBe(true);
    expect(result.name).toBe("Test Product");
  });

  it("parses a numeric price", () => {
    const result = normalizeRecord({
      url: "https://example.com/p/2",
      name: "Product Two",
      price: 49.5,
      in_stock: false,
    });
    expect(result.priceCents).toBe(4950);
    expect(result.inStock).toBe(false);
  });

  it("throws on missing required fields", () => {
    expect(() =>
      normalizeRecord({ url: "", name: "X", price: "10", in_stock: true })
    ).toThrow();
  });
});

describe("normalizeBatch", () => {
  it("skips bad records and keeps good ones", () => {
    const onError = vi.fn();
    const results = normalizeBatch(
      [
        { url: "https://example.com/1", name: "Good", price: "$10", in_stock: true },
        { url: "", name: "Bad", price: "$10", in_stock: true },
      ],
      onError
    );
    expect(results).toHaveLength(1);
  });
});
