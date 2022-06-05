import { Index } from "solid-js";
import { boxes, nColumn, getLevel, LevelEnum } from "../store";
import { Box } from "./Box";

export function Board() {
  const style = () => {
    if (getLevel() === LevelEnum.HARD) {
      return `grid-template-columns: repeat(${nColumn()}, minmax(0, 1fr));`;
    }

    return "";
  };

  return (
    <ul
      class="max-w-lg grid grid-cols-9 gap-x-0.5 gap-y-1"
      classList={{ ["grid-cols-" + nColumn()]: true }}
      style={style()}
    >
      <Index each={boxes}>
        {(box, index) => <Box class={"grid-cols-12"} box={box} index={index} />}
      </Index>
    </ul>
  );
}
