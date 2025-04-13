declare module 'pino-roll' {
  interface PinoRollOptions {
    /** The file to write logs to */
    file: string;
    /** The size at which to roll. Examples: "10m", "100k", "1g" */
    size?: string;
    /** The interval at which to roll. Examples: "1d", "1h", "1w" */
    interval?: string;
    /** Whether to create directories if they don't exist */
    mkdir?: boolean;
    /** How many files to keep */
    keep?: number;
    /** The timezone to use for the timestamp */
    tz?: string;
  }

  export default function pinoRoll(options: PinoRollOptions): NodeJS.WritableStream;
}