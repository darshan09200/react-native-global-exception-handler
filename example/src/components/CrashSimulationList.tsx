import { Text, View, StyleSheet, Platform } from 'react-native';

import {
  CrashType,
  simulateNativeCrash,
} from 'react-native-global-exception-handler';

import Button from './Button';
import type { HandlerName } from '../types';

type Props = {
  handlerName?: HandlerName;
};

const CrashSimulationList = ({ handlerName }: Props) => {
  const triggerJSError = () => {
    // Intentionally throw to test JS handler
    throw new Error('Test JavaScript Error (intentional for testing)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exception Handler Test</Text>

      <View style={styles.statusContainer}>
        {handlerName ? (
          <>
            <Text style={styles.statusText}>Handler Status: ✅ Active</Text>
            <Text style={styles.statusText}>Handler: {handlerName}</Text>
          </>
        ) : (
          <Text style={styles.statusText}>Handler Status: ❌ Not Set</Text>
        )}
        <Text style={styles.statusText}>Platform: {Platform.OS}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={triggerJSError} label="Text JS error" />
        {Object.values(CrashType).map((crashType) => (
          <Button
            key={crashType}
            label={`Test Native Crash - ${crashType.toUpperCase()}`}
            onPress={() => {
              simulateNativeCrash(crashType);
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default CrashSimulationList;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3,
  },
  statusText: { fontSize: 16, textAlign: 'center', fontWeight: '600' },
  buttonContainer: { marginBottom: 20 },
});
