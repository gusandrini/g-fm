import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 56,
    paddingHorizontal: 16,
  },
  iconLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  iconRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1220',
    textAlign: 'center',
  },
});
