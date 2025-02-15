import { Enums } from "@constants";
import { AbstractAction } from "./AbstractAction";
import { EventArguments } from "@type/constants/event";

export abstract class AbstractEvent extends AbstractAction {
  public readonly once: boolean;
  public readonly category: Enums.EventCategoryType;

  /**
   * Constructor for the AbstractEvent class
   *
   * @param {EventArguments} options - Event arguments
   * @param {string} options.name - Event name
   * @param {boolean} [options.once=false] - Whether the event should only be triggered once
   * @param {Enums.EventCategoryType} [options.category=Enums.EventCategoryType.BOT] - The category of the event
   */
  constructor({ name, once = false, category = Enums.EventCategoryType.BOT }: EventArguments) {
    super(name);

    this.once = once;
    this.category = category;
  }
}