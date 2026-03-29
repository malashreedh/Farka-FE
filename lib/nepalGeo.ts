export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  Kathmandu: [27.7172, 85.324],
  Lalitpur: [27.6644, 85.3188],
  Bhaktapur: [27.671, 85.4298],
  Pokhara: [28.2096, 83.9856],
  Chitwan: [27.5291, 84.3542],
  Biratnagar: [26.4525, 87.2718],
  Butwal: [27.7, 83.45],
};

export const DISTRICT_POSITIONS: Record<string, { x: number; y: number }> = {
  Kathmandu: { x: 56, y: 48 },
  Lalitpur: { x: 58, y: 52 },
  Bhaktapur: { x: 64, y: 47 },
  Pokhara: { x: 37, y: 42 },
  Chitwan: { x: 50, y: 58 },
  Butwal: { x: 28, y: 62 },
  Biratnagar: { x: 84, y: 58 },
};

export const TRADE_COLORS: Record<string, string> = {
  construction: "#dc143c",
  hospitality: "#003893",
  manufacturing: "#7c3aed",
  agriculture: "#2e8b57",
  domestic: "#c96f3f",
  transport: "#0f766e",
  tech: "#2563eb",
  other: "#64748b",
};
