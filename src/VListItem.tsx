import { type ReactNode } from 'react';
import { View } from 'react-native';

/**
 * `VListItemProps` describe the props for each virtualized list item.
 *
 * - `itemKey` (required) must be a unique identifier for this item.
 * - `size` (optional) can be:
 *    - A fixed numeric height (for vertical lists), or
 *    - A function that returns a numeric height.
 *      In a real-world scenario, you might want to measure actual size via onLayout,
 *      but that complicates pre-measuring for getItemLayout in FlatList.
 * - `children` is the content to be rendered for this item.
 */
export interface VListItemProps {
  /**
   * Unique key to identify this item for virtualization.
   * This will be used as the `keyExtractor` in the underlying FlatList.
   */
  itemKey: string;

  /**
   * Define the size (height) of this item in pixels.
   * Either a static number or a function returning a number.
   * Defaults to 50 if not provided.
   */
  size?: number | (() => number);

  /**
   * The component(s) you want to render for this list item.
   */
  children?: ReactNode;
}

/**
 * `VListItem` serves as a wrapper for child elements, so that `VList` can pick up on:
 *  - the `itemKey` prop
 *  - the `size` of each item
 *
 * In this skeleton implementation, we simply return a <View> wrapping the children.
 */
const VListItem = ({ children }: VListItemProps) => {
  return <View>{children}</View>;
};

export default VListItem;
