export function countdownState(now, start, end) {
  const remaining = Math.max(0, new Date(start).getTime() - now);
  const seconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
    status: now < new Date(start).getTime() ? 'upcoming' : now <= new Date(end).getTime() ? 'live' : 'ended'
  };
}
