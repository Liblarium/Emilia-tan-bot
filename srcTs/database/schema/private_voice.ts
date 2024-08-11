/* eslint-disable indent */
import { Column, Entity, PrimaryColumn } from "typeorm";
import { IPrivateVoice } from "../../../types/database/schema/private_voice";

@Entity({ name: "privateVoice" })
class PrivateVoice implements IPrivateVoice {
  @PrimaryColumn({ type: "bigint" })
  id!: IPrivateVoice["id"];

  @Column({ type: "bigint" })
  owner!: IPrivateVoice["owner"];

  @Column({ type: "bigint" })
  guild!: IPrivateVoice["guild"];
}


export { PrivateVoice, IPrivateVoice };
