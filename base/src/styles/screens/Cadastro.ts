import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA', // fundo claro
  },
  keyboard: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#0B1220', // texto principal escuro
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    borderColor: '#E5E7EB', // borda suave
    backgroundColor: '#FFFFFF', // fundo do campo
    color: '#0B1220', // texto do input
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#22C55E', // verde principal
  },
  buttonText: {
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
    color: '#FFFFFF', // texto do botão
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF', // texto branco sobre overlay escuro
  },
});
