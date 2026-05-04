type LogContext = Record<string, string | number | boolean | null | undefined>;

function formatContext(context?: LogContext): string {
  if (!context) {
    return "";
  }

  return ` ${JSON.stringify(context)}`;
}

export const logger = {
  info(message: string, context?: LogContext): void {
    console.info(`[info] ${message}${formatContext(context)}`);
  },
  error(message: string, context?: LogContext): void {
    console.error(`[error] ${message}${formatContext(context)}`);
  }
};
