import React, { type ReactNode, useMemo } from 'react';
import {
  FlatList,
  type FlatListProps,
  type ListRenderItemInfo,
} from 'react-native';

import VListItem, { type VListItemProps } from './VListItem';
import { resolveSize, computeItemHeightsAndOffsets } from './utils';

/**
 * `VListProps` extends all props of FlatList, except for the ones we explicitly override:
 *  - `data`, `renderItem`, `keyExtractor`, `getItemLayout`
 *
 * Additionally, `children` must be one or more `VListItem` components.
 */
export interface VListProps
  extends Omit<
    FlatListProps<InternalDataItem>,
    'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'
  > {
  /**
   * One or more `<VListItem />` elements.
   */
  children?: ReactNode;
}

/**
 * Internal structure to hold each child's relevant data for virtualization.
 */
interface InternalDataItem {
  key: string;
  size: number;
  element: React.ReactElement<VListItemProps>;
}

/**
 * `VList` collects all `<VListItem />` children, extracts their keys and sizes,
 * and then transforms them into a dataset consumable by a `FlatList`.
 *
 * By doing so, we can replicate a "ScrollView-like" API (via children),
 * but behind the scenes leverage virtualization from `FlatList`.
 */
const VList = (props: VListProps) => {
  const { children, ...restProps } = props;

  /**
   * Convert children into an array of `InternalDataItem`.
   * Each `VListItem` must have a unique `itemKey` prop.
   */
  const data = useMemo<InternalDataItem[]>(() => {
    const childArray = React.Children.toArray(children);

    return childArray
      .filter((child) => {
        // Only keep valid <VListItem> elements.
        return React.isValidElement(child) && child.type === VListItem;
      })
      .map((child) => {
        const element = child as React.ReactElement<VListItemProps>;
        const { itemKey, size } = element.props;

        if (!itemKey) {
          throw new Error(
            `VList: Each VListItem must have a unique "itemKey" prop.`
          );
        }

        return {
          key: itemKey,
          size: resolveSize(size),
          element,
        };
      });
  }, [children]);

  /**
   * Precompute item heights and offsets, so `getItemLayout` can be fast (and synchronous).
   * This allows FlatList to skip measurements entirely if you provide every item's layout.
   */
  const { itemHeights, itemOffsets } = useMemo(() => {
    return computeItemHeightsAndOffsets(data);
  }, [data]);

  /**
   * `renderItem` simply renders the corresponding <VListItem> element.
   * We could optionally inject extra props (like the item's index) here.
   */
  const renderItem = (info: ListRenderItemInfo<InternalDataItem>) => {
    const { item } = info;

    // Here, we clone the original element to maintain any props, plus optionally add new ones.
    return React.cloneElement(item.element, {});
  };

  /**
   * `keyExtractor` uses the `itemKey` from each <VListItem>.
   */
  const keyExtractor = (item: InternalDataItem) => {
    return item.key;
  };

  /**
   * `getItemLayout` allows FlatList to optimize positioning and scrolling
   * without having to measure items on the fly.
   */
  const getItemLayout = (
    _data: ArrayLike<InternalDataItem> | null | undefined,
    index: number
  ) => {
    return {
      length: itemHeights[index],
      offset: itemOffsets[index],
      index,
    };
  };

  /**
   * Finally, render the FlatList with our transformed `data`, providing:
   *  - `renderItem`
   *  - `keyExtractor`
   *  - `getItemLayout`
   *
   * All other props (`restProps`) are spread in, so you can still use
   * `onEndReached`, `initialNumToRender`, `ListEmptyComponent`, etc.
   */
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      {...restProps}
    />
  );
};

export default VList;
