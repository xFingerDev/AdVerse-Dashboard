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

  if (num === 0) return "0";

  const format = formats.find((f) => num >= f.threshold);
  if (format) {
    const value = num / format.threshold;
    return `${parseFloat(value.toPrecision(3))}${format.suffix}`;
  }

  return decimal
    ? num.toFixed(Math.min(2, Math.max(0, 3 - Math.floor(Math.log10(num) + 1))))
    : num.toFixed(0);
};
