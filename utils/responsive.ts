import { Dimensions, PixelRatio, Platform } from 'react-native';

// Lấy kích thước màn hình
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Thiết kế chuẩn (base design) - iPhone 14
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

/**
 * Scale width theo tỉ lệ màn hình
 * @param size - Kích thước thiết kế gốc
 * @returns Kích thước đã scale
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
};

/**
 * Scale height theo tỉ lệ màn hình
 * @param size - Kích thước thiết kế gốc
 * @returns Kích thước đã scale
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / DESIGN_HEIGHT) * size;
};

/**
 * Scale font size với giới hạn để tránh quá lớn/nhỏ
 * @param size - Font size thiết kế gốc
 * @param factor - Hệ số scale (default 0.5 = scale ít hơn để text ổn định)
 * @returns Font size đã scale
 */
export const scaleFont = (size: number, factor: number = 0.5): number => {
  const newSize = size + (scaleWidth(size) - size) * factor;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Scale moderate - dùng cho padding, margin
 * Ít scale hơn để giữ layout gọn
 */
export const scaleModerate = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Breakpoints cho responsive
 */
export const breakpoints = {
  small: 360,  // Màn hình nhỏ (SE, old Android)
  medium: 390, // Màn hình trung bình (iPhone 14/15)
  large: 430,  // Màn hình lớn (iPhone Pro Max)
  tablet: 768, // Tablet
};

/**
 * Check loại thiết bị
 */
export const isSmallDevice = SCREEN_WIDTH < breakpoints.small;
export const isMediumDevice = SCREEN_WIDTH >= breakpoints.small && SCREEN_WIDTH < breakpoints.large;
export const isLargeDevice = SCREEN_WIDTH >= breakpoints.large && SCREEN_WIDTH < breakpoints.tablet;
export const isTablet = SCREEN_WIDTH >= breakpoints.tablet;

/**
 * Get responsive value theo breakpoint
 * @example getResponsiveValue({ small: 12, medium: 16, large: 20 })
 */
export const getResponsiveValue = <T extends any>(values: {
  small?: T;
  medium?: T;
  large?: T;
  tablet?: T;
  default: T;
}): T => {
  if (isTablet && values.tablet !== undefined) return values.tablet;
  if (isLargeDevice && values.large !== undefined) return values.large;
  if (isMediumDevice && values.medium !== undefined) return values.medium;
  if (isSmallDevice && values.small !== undefined) return values.small;
  return values.default;
};

/**
 * Dimensions thông dụng
 */
export const dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
};

