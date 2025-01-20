/**
 * `resolveSize` converts the `size` prop into a concrete number.
 * If the user provided a function, we call it once. Otherwise, we return the number as is.
 * The default value (if not specified) is 50.
 */
export function resolveSize(size?: number | (() => number)): number {
  if (typeof size === 'function') {
    return size();
  }
  if (typeof size === 'number') {
    return size;
  }
  // Default fallback
  return 50;
}

/**
 * Given an array of items (with each item containing a `size` property),
 * compute:
 *   1. `itemHeights`: an array of numeric heights (one per item)
 *   2. `itemOffsets`: an array of offsets for each item (for use in getItemLayout)
 *
 * Example:
 *   itemHeights = [50, 75, 75]
 *   itemOffsets = [0, 50, 125]
 */
export function computeItemHeightsAndOffsets(items: { size: number }[]): {
  itemHeights: number[];
  itemOffsets: number[];
} {
  const itemHeights = items.map((i) => i.size);
  const itemOffsets: number[] = [];

  let runningOffset = 0;
  for (let i = 0; i < itemHeights.length; i++) {
    itemOffsets.push(runningOffset);
    runningOffset += itemHeights[i];
  }

  return { itemHeights, itemOffsets };
}
