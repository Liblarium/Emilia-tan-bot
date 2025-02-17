import { Abstract } from "@constants";
import { db } from "@client";
import { User } from "@prisma/client";

export class UserRepository extends Abstract.AbstractRepository<User> {
  constructor() {
    super(db, "user");
  }
}