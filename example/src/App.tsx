import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import CrashSimulationList from './components/CrashSimulationList';
import { HandlerName } from './types';
import { SimulationsMapping } from './defines';

export default function App() {
  const [handlerName, setHandlerName] = useState<HandlerName>(
    HandlerName.default
  );
  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <SafeAreaView style={styles.safeArea}>
          {Object.values(SimulationsMapping).map(
            ({ name, component: SimulationComponent }) => (
              <SimulationComponent
                key={name}
                setHandlerName={setHandlerName}
                handlerName={handlerName}
              />
            )
          )}

          <View style={styles.divider} />
          <CrashSimulationList handlerName={handlerName} />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  safeArea: {
    margin: 20,
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
});
