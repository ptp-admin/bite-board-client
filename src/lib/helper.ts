export const costAccuracyBgColor = (costAccuracy: number) => {
	if (costAccuracy < 0.25) return 'bg-error-500 text-surface-100';
	if (costAccuracy >= 0.25 && costAccuracy < 0.5) return 'bg-error-300';
	if (costAccuracy >= 0.5 && costAccuracy < 0.75) return 'bg-warning-400/70';
	if (costAccuracy >= 0.75) return 'bg-success-400';
};
