import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1220',
    marginBottom: 12,
  },

  // Card usado para instituição e item na lista/modal
  ongCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  ongName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1220',
    marginBottom: 8,
  },
  ongInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ongInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },

  // Botão "Selecionar instituição / itens"
  selectOngButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  selectOngButtonText: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '500',
    marginTop: 8,
  },

  // Label de campos (ex: "Observação")
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0B1220',
    marginBottom: 8,
  },

  // Observação (textarea)
  observacaoInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#0B1220',
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // 🔹 Container dos itens selecionados
  selectedItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B1220',
    marginBottom: 8,
  },
  selectedItemsChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F0FDF4',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#22C55E',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
  },

  // Botão principal
  button: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Loading overlay
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
