import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  return useFonts({
    'Inter-Black': require('../../../assets/fonts/Inter/Inter_18pt-Black.ttf'),
    'Inter': require('../../../assets/fonts/Inter/Inter_18pt-Regular.ttf'),
    // Adicione mais fontes aqui se necessário
  });
};
