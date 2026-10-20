/** Resolves a file from /public against Vite's base path (works for "/" and "./" deployments). */
export const asset = (p) => `${import.meta.env.BASE_URL || './'}${p}`;
