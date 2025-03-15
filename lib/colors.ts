// Background colors
export const COLORS = {
  // Background colors
  bgPrimary: "#0B0F1A",
  bgSecondary: "#1C2333",
  bgTertiary: "#2C3444",
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#B6F400",
  textMuted: "#9CA3AF", // gray-400
  
  // Brand colors
  brandPrimary: "#B6F400",
  brandPrimaryHover: "#9ED900",
  
  // Status colors
  error: "#EF4444", // red-500
  success: "#10B981", // green-500
  
  // Border colors
  border: "#2C3444"
}

// You can also create theme-specific objects if needed
export const DARK_THEME = {
  background: COLORS.bgPrimary,
  card: COLORS.bgSecondary,
  input: COLORS.bgTertiary,
  text: COLORS.textPrimary,
  textMuted: COLORS.textMuted,
  accent: COLORS.brandPrimary,
  accentHover: COLORS.brandPrimaryHover,
  error: COLORS.error
}

// Export default for easier imports
export default COLORS;