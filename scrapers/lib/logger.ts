type Level = "info" | "warn" | "error" | "debug";

function timestamp() {
  return new Date().toISOString();
}

function write(level: Level, msg: string, meta?: Record<string, unknown>) {
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${msg}`;
  const out = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  out(meta ? `${line} ${JSON.stringify(meta)}` : line);
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => write("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => write("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => write("error", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (process.env.DEBUG) write("debug", msg, meta);
  },
};
