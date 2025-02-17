import { Abstract } from "@constants";
import { db } from "@client";
import { Dostup } from "@prisma/client";

export class DostupRepository extends Abstract.AbstractRepository<Dostup> {
  constructor() {
    super(db, "dostup");
  }
}