import { EventCagetoryType } from "@constants/enum/EventCagetoryType";
import { AbstractAction } from "./AbstractAction";
import { EventArguments } from "@type/constants/event";

export abstract class AbstractEvent extends AbstractAction {
  public readonly once: boolean;
  public readonly category: EventCagetoryType;

  /**
   * Constructor for the AbstractEvent class
   *
   * @param {EventArguments} options - Event arguments
   * @param {string} options.name - Event name
   * @param {boolean} [options.once=false] - Whether the event should only be triggered once
   * @param {EventCagetoryType} [options.category=EventCagetoryType.BOT] - The category of the event
   */
  constructor({ name, once = false, category = EventCagetoryType.BOT }: EventArguments) {
    super(name);

    this.once = once;
    this.category = category;
  }
}