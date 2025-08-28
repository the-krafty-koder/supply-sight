import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should update value after the specified delay", async () => {
    vi.useFakeTimers();

    let value = "first";
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    expect(result.current).toBe("first");

    value = "second";
    rerender();

    expect(result.current).toBe("first");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("second");

    vi.useRealTimers();
  });
});
