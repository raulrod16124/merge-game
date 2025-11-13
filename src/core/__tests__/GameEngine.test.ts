import {GameEngine} from '../GameEngine';
import {describe, expect, test} from 'vitest';

describe('GameEngine', () => {
  test('debe fusionar tres arbustos en un árbol', () => {
    const engine = new GameEngine(4, 4);
    engine.addItem('bush', {x: 0, y: 0});
    engine.addItem('bush', {x: 1, y: 0});
    engine.addItem('bush', {x: 2, y: 0});

    engine.tryMergeAt({x: 1, y: 0});

    const state = engine.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].type).toBe('tree');
  });
});
