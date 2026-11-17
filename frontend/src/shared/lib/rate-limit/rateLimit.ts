export const RATE_LIMIT_KEY = "grammar_test_button_disabled";
export const RATE_LIMIT_TIME_KEY = "grammar_test_button_time";
const RATE_LIMIT_DURATION = 60;

export const rateLimit = {
  isBlocked(): boolean {
    return sessionStorage.getItem(RATE_LIMIT_KEY) === "true";
  },
  start(): void {
    sessionStorage.setItem(RATE_LIMIT_KEY, "true");
    sessionStorage.setItem(RATE_LIMIT_TIME_KEY, String(Date.now()));
  },
  clear(): void {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
    sessionStorage.removeItem(RATE_LIMIT_TIME_KEY);
  },
  getSecondsLeft(): number {
    const savedTime = sessionStorage.getItem(RATE_LIMIT_TIME_KEY);
    if (!savedTime) return RATE_LIMIT_DURATION;
    const elapsed = Math.floor((Date.now() - Number(savedTime)) / 1000);
    return Math.max(0, RATE_LIMIT_DURATION - elapsed);
  },
  duration: RATE_LIMIT_DURATION,
};
