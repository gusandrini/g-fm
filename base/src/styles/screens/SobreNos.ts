import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  icon: { marginRight: 12, marginTop: 4 },
  text: { flex: 1, fontSize: 16, lineHeight: 22 },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    marginTop: 16,
    gap: 8,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
