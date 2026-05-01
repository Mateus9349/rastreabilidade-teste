import { MD3LightTheme } from 'react-native-paper';

export const theme = {
    ...MD3LightTheme,
    roundness: 12,

    colors: {
        ...MD3LightTheme.colors,

        // 🔵 Cor principal (ações)
        primary: '#2563EB', // azul moderno (melhor que o anterior)
        onPrimary: '#FFFFFF',

        // 🔷 Secundário (detalhes leves)
        secondary: '#60A5FA',
        onSecondary: '#FFFFFF',

        // 🧱 Background geral (igual ao da imagem)
        background: '#F5F7FA',

        // 📦 Cards
        surface: '#FFFFFF',
        surfaceVariant: '#F1F5F9',

        // 📝 Textos
        onBackground: '#0F172A', // quase preto (títulos)
        onSurface: '#0F172A',
        onSurfaceVariant: '#64748B', // cinza (subtítulo)

        // 🔲 Bordas e divisores
        outline: '#E2E8F0',

        // ❌ erros (mantém padrão)
        error: '#EF4444',
    },
};