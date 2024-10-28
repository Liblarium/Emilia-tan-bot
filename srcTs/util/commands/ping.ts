import type { EmiliaClient } from "@client";
import { Log } from "@log";
import { hexToDecimal } from "@util/s";
import type { APIEmbed } from "discord.js";

export function getPing(
  client: EmiliaClient,
  color: number | string,
): APIEmbed {
  if (typeof color === "string") color = hexToDecimal(color);

  const description = `Мой пинг: ${client.ws.ping.toString()} ms`;
  new Log({ text: description, type: 1, categories: ["global", "command"] });

  return {
    description,
    color,
  };
}
