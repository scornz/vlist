import { Text } from 'react-native';
import { VList, VListItem } from 'vlist';

export default function App() {
  return (
    <VList style={{ flex: 1 }}>
      <VListItem itemKey="item-1" size={100}>
        <Text>Item #1 (height = 100)</Text>
      </VListItem>

      <VListItem itemKey="item-2" size={() => 75}>
        <Text>Item #2 (height = 75)</Text>
      </VListItem>

      <VListItem itemKey="item-3">
        <Text>Item #3 (height = 50 by default)</Text>
      </VListItem>
    </VList>
  );
}
