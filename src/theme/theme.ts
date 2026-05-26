import { alpha, createTheme } from '@mui/material/styles';

export function buildAppTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';
  const primaryMain = isDark ? '#7dd3fc' : '#1d4ed8';
  const primaryContrast = isDark ? '#03131f' : '#eff6ff';
  const secondaryMain = isDark ? '#cbd5e1' : '#475569';
  const backgroundDefault = isDark ? '#06111f' : '#edf4ff';
  const backgroundPaper = isDark ? '#0d1b2d' : '#f8fbff';
  const surface = isDark ? alpha('#10233d', 0.62) : alpha('#ffffff', 0.66);
  const elevatedSurface = isDark ? alpha('#122945', 0.76) : alpha('#ffffff', 0.82);
  const borderColor = isDark ? alpha('#cfe4ff', 0.16) : alpha('#1e3a5f', 0.12);
  const softBorderColor = isDark ? alpha('#dbeafe', 0.10) : alpha('#1e3a5f', 0.08);
  const textPrimary = isDark ? '#eff6ff' : '#0f172a';
  const textSecondary = isDark ? alpha('#eff6ff', 0.76) : alpha('#0f172a', 0.66);
  const mutedSurface = isDark ? alpha('#0f2340', 0.52) : alpha('#f8fbff', 0.72);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        contrastText: primaryContrast,
      },
      secondary: {
        main: secondaryMain,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      divider: softBorderColor,
      background: {
        default: backgroundDefault,
        paper: backgroundPaper,
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      h1: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: '2.2rem',
        letterSpacing: '-0.03em',
      },
      h2: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1.95rem',
        letterSpacing: '-0.03em',
      },
      h3: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1.72rem',
        letterSpacing: '-0.02em',
      },
      h4: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1.42rem',
        letterSpacing: '-0.02em',
      },
      h5: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1.12rem',
        letterSpacing: '-0.01em',
      },
      h6: {
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 600,
        fontSize: '0.96rem',
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontSize: '0.92rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.94rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.82rem',
        lineHeight: 1.55,
      },
      caption: {
        fontSize: '0.74rem',
        letterSpacing: '0.01em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.8rem',
        letterSpacing: '0.01em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            backgroundColor: backgroundDefault,
          },
          body: {
            backgroundImage: isDark
              ? 'radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 30%), linear-gradient(180deg, #05101d 0%, #0a1627 100%)'
              : 'radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 22%), radial-gradient(circle at bottom right, rgba(125,211,252,0.14), transparent 28%), linear-gradient(180deg, #f4f9ff 0%, #e8f1fb 100%)',
            minHeight: '100vh',
            color: textPrimary,
          },
          '#root': {
            minHeight: '100vh',
          },
          '.recharts-cartesian-axis-tick-value, .recharts-legend-item-text': {
            fill: `${textSecondary} !important`,
          },
          '.recharts-label, .recharts-polar-radius-axis-tick-value': {
            fill: `${textSecondary} !important`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: surface,
            border: `1px solid ${borderColor}`,
            borderRadius: 8,
            boxShadow: isDark
              ? '0 24px 64px rgba(2, 6, 23, 0.44)'
              : '0 24px 60px rgba(30, 41, 59, 0.10)',
            backdropFilter: 'blur(24px) saturate(140%)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(backgroundPaper, isDark ? 0.56 : 0.64),
            backgroundImage: 'none',
            boxShadow: 'none',
            backdropFilter: 'blur(24px) saturate(160%)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            paddingInline: 16,
            minHeight: 38,
          },
          contained: {
            backgroundImage: `linear-gradient(135deg, ${primaryMain} 0%, ${alpha(primaryMain, 0.8)} 100%)`,
            boxShadow: isDark
              ? '0 10px 26px rgba(8, 47, 73, 0.34)'
              : '0 10px 24px rgba(29, 78, 216, 0.18)',
            color: primaryContrast,
          },
          outlined: {
            borderColor: borderColor,
            backgroundColor: alpha(backgroundPaper, isDark ? 0.22 : 0.44),
            backdropFilter: 'blur(18px)',
            color: textPrimary,
          },
          text: {
            color: textPrimary,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${softBorderColor}`,
            backgroundColor: alpha(backgroundPaper, isDark ? 0.16 : 0.46),
            backdropFilter: 'blur(14px)',
            color: textPrimary,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${softBorderColor}`,
            backgroundColor: alpha(backgroundPaper, isDark ? 0.58 : 0.72),
            backdropFilter: 'blur(26px) saturate(150%)',
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
            backgroundColor: elevatedSurface,
            border: `1px solid ${borderColor}`,
            backdropFilter: 'blur(26px)',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: alpha(backgroundPaper, isDark ? 0.14 : 0.52),
            backdropFilter: 'blur(16px)',
            color: textPrimary,
            '& fieldset': {
              borderColor: softBorderColor,
            },
            '&:hover fieldset': {
              borderColor: borderColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryMain,
            },
          },
          input: {
            color: textPrimary,
            '&::placeholder': {
              color: textSecondary,
              opacity: 1,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: textSecondary,
            '&.Mui-focused': {
              color: textPrimary,
            },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: textSecondary,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: alpha(backgroundPaper, isDark ? 0.20 : 0.54),
            border: `1px solid ${softBorderColor}`,
            color: textPrimary,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 8,
            backgroundColor: elevatedSurface,
            border: `1px solid ${borderColor}`,
            color: textPrimary,
            backdropFilter: 'blur(24px)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: textPrimary,
            '&.Mui-selected': {
              backgroundColor: alpha(primaryMain, isDark ? 0.18 : 0.10),
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            color: textPrimary,
            '&.Mui-selected': {
              backgroundColor: alpha(primaryMain, isDark ? 0.16 : 0.10),
              border: `1px solid ${alpha(primaryMain, 0.26)}`,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: textSecondary,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: softBorderColor,
            color: textPrimary,
          },
          head: {
            color: textSecondary,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: primaryMain,
            height: 2,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: textSecondary,
            '&.Mui-selected': {
              color: textPrimary,
            },
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            color: primaryContrast,
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: mutedSurface,
            color: textPrimary,
            border: `1px solid ${borderColor}`,
          },
        },
      },
    },
  });
}
