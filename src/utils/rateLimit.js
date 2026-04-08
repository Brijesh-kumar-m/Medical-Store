// Rate limiter utility - prevents API abuse on login/checkout
const attempts = new Map();

export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: 0 };
  }

  // Reset window if expired
  if (now - record.firstAttempt > windowMs) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: 0 };
  }

  // Within window
  if (record.count >= maxAttempts) {
    const resetIn = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count += 1;
  attempts.set(key, record);
  return { allowed: true, remaining: maxAttempts - record.count, resetIn: 0 };
}

export function resetRateLimit(key) {
  attempts.delete(key);
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts) {
    if (now - record.firstAttempt > 300000) {
      attempts.delete(key);
    }
  }
}, 300000);
