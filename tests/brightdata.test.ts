import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.BRIGHTDATA_API_TOKEN = "test-token";

const { runCollector } = await import("../scrapers/lib/brightdata.js");

describe("runCollector", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("triggers a collector and returns results once ready", async () => {
    const fetchMock = vi
      .fn()
      // trigger response
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ collection_id: "snap_123" }),
      })
      // dataset response — ready immediately
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [{ url: "https://example.com/1", name: "Item", price: "9.99", in_stock: true }],
      });

    vi.stubGlobal("fetch", fetchMock);

    const results = await runCollector("c_test", ["https://example.com/1"]);
    expect(results).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("polls again while the dataset is still processing (202)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ collection_id: "snap_456" }) })
      .mockResolvedValueOnce({ ok: false, status: 202 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] });

    vi.stubGlobal("fetch", fetchMock);
    vi.useFakeTimers();

    const promise = runCollector("c_test", ["https://example.com/1"]);
    await vi.advanceTimersByTimeAsync(5000);
    const results = await promise;

    expect(results).toEqual([]);
    vi.useRealTimers();
  });
});
