import { Index } from 'solid-js';
import { boxes, nColumn } from '../store';
import { Box } from './Box';

export function Board() {
  return (
    <ul
      class='max-w-lg grid gap-x-0.5 gap-y-1'
      classList={{ ['grid-cols-' + nColumn()]: true }}
    >
      <Index each={boxes}>
        {(box, index) => <Box box={box} index={index} />}
      </Index>
    </ul>
  );
}
