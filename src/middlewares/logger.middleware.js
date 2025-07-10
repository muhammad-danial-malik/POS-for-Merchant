const logger = (req, res, next) => {
  const startHrTime = process.hrtime();
  const requestTime = new Date().toISOString();

  res.on("finish", () => {
    const diff = process.hrtime(startHrTime);
    const durationInSeconds = (diff[0] + diff[1] / 1e9).toFixed(3);
    console.log(
      `[${requestTime}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${durationInSeconds} sec`
    );
  });

  next();
};

export default logger;
