/**
 * Formats a number into a human-readable string with metric suffixes (K, M, B, T).
 * This custom implementation was created because Intl.NumberFormat has inconsistent behavior on iOS devices.
 *
 * @param num - The number to format
 * @param decimal - Whether to include decimal places in the output (defaults to true)
 * @returns A formatted string with appropriate metric suffix
 *
 * @example
 * formatNumericAbbreviation(1234567, true) // returns "1.23M"
 * formatNumericAbbreviation(1000, false) // returns "1K"
 * formatNumericAbbreviation(999) // returns "999"
 *
 * @remarks
 * - Handles numbers from 0 to trillions
 * - Uses suffixes: K (thousands), M (millions), B (billions), T (trillions)
 * - When decimal is true, maintains precision of 3 significant digits
 */
export const formatNumericAbbreviation = (
  num: number,
  decimal: boolean = true
): string => {
  const formats = [
    { threshold: 1e12, suffix: "T" },
    { threshold: 1e9, suffix: "B" },
    { threshold: 1e6, suffix: "M" },
    { threshold: 1e3, suffix: "K" },
  ];

  if (num === 0) return decimal ? "0.00" : "0";

  const format = formats.find((f) => num >= f.threshold);
  if (format) {
    const value = num / format.threshold;
    return `${parseFloat(value.toPrecision(3))}${format.suffix}`;
  }

  return decimal
    ? num.toFixed(Math.min(2, Math.max(0, 3 - Math.floor(Math.log10(num) + 1))))
    : num.toFixed(0);
};
