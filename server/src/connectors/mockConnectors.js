// Mock platform connectors for demo and testing
// Each connector exports getOrdersForWorker(platform, workerId, sinceDate)

export async function getOrdersForWorker(platform, workerId, sinceDate) {
  // return sample orders for the given workerId
  // sinceDate can be used to limit results; here we ignore for simplicity
  const now = new Date();
  const sample = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    sample.push({
      orderId: `${platform.toUpperCase().slice(0,3)}-${workerId}-${i}`,
      amount: Math.floor(50 + Math.random() * 300),
      date: d.toISOString(),
      platform,
    });
  }

  return sample;
}
