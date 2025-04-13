/**
 * Utility function to safely stringify objects for logging
 */
export function safeStringify(obj: any, indent = 2): string {
  try {
    // Handle circular references
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular Reference]";
          }
          seen.add(value);
        }

        // Handle special objects like ReadableStream
        if (value && typeof value === "object") {
          if (value instanceof ReadableStream) {
            return "[ReadableStream]";
          }
          if (value instanceof Response) {
            return "[Response]";
          }
          if (value instanceof Request) {
            return "[Request]";
          }
          if (value instanceof Headers) {
            return "[Headers]";
          }
          if (value instanceof FormData) {
            return "[FormData]";
          }
        }

        return value;
      },
      indent
    );
  } catch (error) {
    return `[Error stringifying object: ${error}]`;
  }
}
