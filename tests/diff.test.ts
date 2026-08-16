import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase client before importing diff.ts, since diff.ts imports it at module load time.
const mockSupabase = {
  from: vi.fn(),
};

vi.mock("../scrapers/lib/supabase.js", () => ({ supabase: mockSupabase }));

const { diffLatestSnapshot } = await import("../scrapers/diff.js");

function mockSnapshots(rows: { price_cents: number; in_stock: boolean }[]) {
  mockSupabase.from.mockReturnValue({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: rows, error: null }),
        }),
      }),
    }),
  });
}

describe("diffLatestSnapshot", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when there is only one snapshot", async () => {
    mockSnapshots([{ price_cents: 1000, in_stock: true }]);
    const result = await diffLatestSnapshot("product-1");
    expect(result).toBeNull();
  });

  it("detects a price drop", async () => {
    mockSnapshots([
      { price_cents: 900, in_stock: true },
      { price_cents: 1000, in_stock: true },
    ]);
    const result = await diffLatestSnapshot("product-1");
    expect(result?.type).toBe("price_drop");
    expect(result?.newValue).toBe("9.00");
  });

  it("detects a restock", async () => {
    mockSnapshots([
      { price_cents: 1000, in_stock: true },
      { price_cents: 1000, in_stock: false },
    ]);
    const result = await diffLatestSnapshot("product-1");
    expect(result?.type).toBe("restock");
  });

  it("returns null when nothing notable changed", async () => {
    mockSnapshots([
      { price_cents: 1000, in_stock: true },
      { price_cents: 1000, in_stock: true },
    ]);
    const result = await diffLatestSnapshot("product-1");
    expect(result).toBeNull();
  });
});
