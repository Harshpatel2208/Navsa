// Shared design tokens used across the e-commerce pages
export const colors = {
  navy:     '#293681',
  navyDeep: '#0a1128',
  accent:   '#c9a84c',
  paper:    '#D0E7E6',
  hairline: '#95CCDD',
  inkMuted: '#5a6a7e',
}

export const fonts = {
  display: "'Inter', 'Segoe UI', Arial, sans-serif",
  body:    "'Inter', 'Segoe UI', Arial, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Mono', monospace",
}

// Modern surface tokens — soft corners + subtle depth (same palette)
export const radius = {
  sm: '10px',
  md: '14px',
  lg: '20px',
  pill: '9999px',
}

export const shadow = {
  // Soft ambient card shadow at rest
  soft: '0 1px 2px rgba(10, 17, 40, 0.04), 0 8px 24px rgba(10, 17, 40, 0.06)',
  // Elevated hover shadow
  hover: '0 6px 14px rgba(10, 17, 40, 0.08), 0 18px 40px rgba(10, 17, 40, 0.12)',
  // Subtle inset-free border replacement
  hairline: '0 0 0 1px rgba(149, 204, 221, 0.5)',
}

// Ready-made card style for the modern look
export const cardStyle = {
  background: '#fff',
  border: '1px solid rgba(149, 204, 221, 0.6)',
  borderRadius: radius.md,
  boxShadow: shadow.soft,
}
