import type {
  MessageComponentInteraction,
  ActionRow,
  MessageActionRowComponent,
  AnyComponent
} from "discord.js";
import type { ComponentPosition, ComponentResult } from "@type";
import { validateComponentPosition } from "./validateComponentPosition.js";
import { ErrorCode } from "@enum/errorCode";

/**
 * Finds a component in a message by its position.
 * @param interaction - Message component interaction.
 * @param position - Component position.
 * @returns Component or an error if the interaction or components are missing, or the position is invalid.
 * @throws {Error} If the component is not found at the given position.
 */
export function getMessageComponent(
  interaction: MessageComponentInteraction,
  position: ComponentPosition
): ComponentResult<AnyComponent | ActionRow<MessageActionRowComponent> | MessageActionRowComponent> {
  if (!interaction?.message?.components) return {
    success: false,
    error: {
      code: ErrorCode.MISSING_INTERACTION,
      message: "Interaction или компоненты отсутствуют"
    }
  };


  const validationError = validateComponentPosition(position);

  if (validationError) return {
    success: false,
    error: validationError
  };


  const { row, index } = position;
  const components = interaction.message.components;

  try {
    return {
      success: true,
      data: index !== undefined
        ? components[row].components[index]
        : components[row]
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return {
      success: false,
      error: {
        code: ErrorCode.OUT_OF_RANGE,
        message: `Компонент не найден по указанной позиции: ${errorMessage}`
      }
    };
  }
}