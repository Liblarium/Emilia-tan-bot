import { sharMap } from "@util/ball.list";
import { EmiliaError, random } from "@util/s";

export function getRandomBall(rage: number) {
  if (rage > 40) throw new EmiliaError("Вы не можете указать более 40!");
  if (rage < 0) throw new EmiliaError("Вы не можете указать меньше 0!");

  return sharMap[random(0, rage)];
}