import {
    getResponsiveValue,
    isLargeDevice,
    isMediumDevice,
    isSmallDevice,
    isTablet,
    scaleFont,
    scaleHeight,
    scaleModerate,
    scaleWidth
} from '@/utils/responsive';
import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveHelpers {
  width: number;
  height: number;
  scaleWidth: typeof scaleWidth;
  scaleHeight: typeof scaleHeight;
  scaleFont: typeof scaleFont;
  scaleModerate: typeof scaleModerate;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
  getResponsiveValue: typeof getResponsiveValue;
}

/**
 * Hook để theo dõi kích thước màn hình và cung cấp helpers
 * Tự động update khi xoay màn hình
 */
export const useResponsive = (): ResponsiveHelpers => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        setDimensions({ width: window.width, height: window.height });
      }
    );

    return () => subscription?.remove();
  }, []);

  return {
    width: dimensions.width,
    height: dimensions.height,
    scaleWidth,
    scaleHeight,
    scaleFont,
    scaleModerate,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    getResponsiveValue,
  };
};

