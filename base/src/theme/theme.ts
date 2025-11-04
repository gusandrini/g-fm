export type Theme = {
  name: 'light' | 'dark';
  colors: {
    background: string; // tela inteira
    surface: string;    // cards/headers/footers
    text: string;
    mutedText: string;
    primary: string;
    primaryText: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  radii: { xs: number; sm: number; md: number; lg: number; xl: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  sizes: { header: number; footer: number };
};


export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    text: '#0B1220',
    mutedText: '#6B7280',
    primary: '#22C55E',
    primaryText: '#ffffff',
    border: '#E5E7EB',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  radii: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  sizes: { header: 56, footer: 64 },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: '#0C111B',  
    surface: '#111827',
    text: '#E5E7EB',
    mutedText: '#94A3B8',
    primary: '#22C55E',
    primaryText: '#0B1220',
    border: '#1F2937',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#F87171',
  },
  radii: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  sizes: { header: 56, footer: 64 },
};
