// Responsive grid configurations for different devices and orientations
export const getResponsiveGridConfig = () => ({
  // Grid columns for different breakpoints
  gridColumns: {
    xs: "repeat(2, 1fr)",     // Mobile portrait: 2 columns
    sm: "repeat(2, 1fr)",     // Mobile landscape/Small tablet: 2 columns
    md: "repeat(3, 1fr)",     // Tablet portrait: 3 columns
    lg: "repeat(4, 1fr)",     // Desktop/Tablet landscape: 4 columns
    xl: "repeat(5, 1fr)",     // Large desktop: 5 columns
  },

  // Gap between grid items
  gridGap: {
    xs: "12px",   // Mobile: smaller gaps for space efficiency
    sm: "16px",   // Small tablet: moderate gaps
    md: "20px",   // Tablet: comfortable gaps
    lg: "24px",   // Desktop: spacious gaps
    xl: "28px",   // Large desktop: generous gaps
  },

  // Card heights for different devices
  cardHeight: {
    xs: "280px",  // Mobile: compact for scrolling
    sm: "320px",  // Small tablet: slightly taller
    md: "380px",  // Tablet: comfortable viewing
    lg: "420px",  // Desktop: optimal size
    xl: "450px",  // Large desktop: premium experience
  },

  // Padding for containers
  containerPadding: {
    xs: "16px",   // Mobile: minimal padding
    sm: "20px",   // Small tablet
    md: "32px",   // Tablet
    lg: "40px",   // Desktop
    xl: "60px",   // Large desktop: spacious
  },

  // Font sizes for different elements
  typography: {
    title: {
      xs: "12px",
      sm: "13px",
      md: "14px",
      lg: "15px",
      xl: "16px",
    },
    hashtag: {
      xs: "10px",
      sm: "11px",
      md: "11px",
      lg: "12px",
      xl: "12px",
    },
    button: {
      xs: "10px",
      sm: "11px",
      md: "12px",
      lg: "12px",
      xl: "13px",
    },
  },

  // Button sizes
  buttonSize: {
    padding: {
      xs: "4px 8px",
      sm: "6px 12px",
      md: "6px 12px",
      lg: "8px 16px",
      xl: "8px 16px",
    },
    borderRadius: {
      xs: "16px",
      sm: "18px",
      md: "20px",
      lg: "20px",
      xl: "22px",
    },
  },

  // Hover effects for different devices
  hoverEffects: {
    transform: {
      xs: "translateY(-2px)",  // Mobile: subtle
      sm: "translateY(-3px)",  // Small tablet
      md: "translateY(-4px)",  // Tablet
      lg: "translateY(-6px)",  // Desktop: pronounced
      xl: "translateY(-8px)",  // Large desktop: dramatic
    },
    boxShadow: {
      xs: "0 4px 16px rgba(108, 92, 231, 0.2)",
      sm: "0 6px 20px rgba(108, 92, 231, 0.25)",
      md: "0 8px 24px rgba(108, 92, 231, 0.3)",
      lg: "0 12px 32px rgba(108, 92, 231, 0.35)",
      xl: "0 16px 40px rgba(108, 92, 231, 0.4)",
    },
  },
});

// Admin grid configuration
export const getAdminGridConfig = () => ({
  gridColumns: {
    xs: "repeat(2, 1fr)",     // Mobile: 2 columns
    sm: "repeat(3, 1fr)",     // Small tablet: 3 columns
    md: "repeat(4, 1fr)",     // Tablet: 4 columns
    lg: "repeat(5, 1fr)",     // Desktop: 5 columns
    xl: "repeat(6, 1fr)",     // Large desktop: 6 columns
  },
  
  cardHeight: {
    xs: "200px",  // Mobile: compact admin view
    sm: "240px",  // Small tablet
    md: "280px",  // Tablet
    lg: "300px",  // Desktop
    xl: "320px",  // Large desktop
  },
  
  gridGap: {
    xs: "8px",    // Mobile: tight spacing for admin
    sm: "12px",   // Small tablet
    md: "16px",   // Tablet
    lg: "20px",   // Desktop
    xl: "24px",   // Large desktop
  },
});

// Utility function to get device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  
  if (width < 600) {
    return isLandscape ? 'mobile-landscape' : 'mobile-portrait';
  } else if (width < 960) {
    return isLandscape ? 'tablet-landscape' : 'tablet-portrait';
  } else if (width < 1280) {
    return 'desktop-small';
  } else if (width < 1920) {
    return 'desktop-medium';
  } else {
    return 'desktop-large';
  }
};

// Orientation-specific adjustments
export const getOrientationConfig = () => {
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobile = window.innerWidth < 600;
  
  if (isMobile && isLandscape) {
    return {
      // Mobile landscape: optimize for horizontal scrolling
      gridColumns: "repeat(3, 1fr)",
      cardHeight: "240px",
      containerPadding: "12px",
    };
  }
  
  return null; // Use default responsive config
};
