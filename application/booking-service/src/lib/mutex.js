// A tiny per-key mutex so two near-simultaneous requests for the SAME vehicle
// are serialized instead of racing. This is what the "double booking" concurrency
// test (JMeter) exercises: without this, two overlapping bookings can both pass
// the availability check before either is persisted.
const locks = new Map();

async function withLock(key, fn) {
  const previous = locks.get(key) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  locks.set(key, previous.then(() => current));
  await previous;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(key) === current) locks.delete(key);
  }
}

module.exports = { withLock };
