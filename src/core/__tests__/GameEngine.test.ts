import {GameEngine} from '../GameEngine';
import {describe, expect, test} from 'vitest';

describe('GameEngine', () => {
  test('debe fusionar tres arbustos en un árbol', () => {
    // dummy test to verify GameEngine is imported correctly
    const engine = new GameEngine(6, 6);
    engine.addItem('bush', {x: 0, y: 0});
    engine.addItem('bush', {x: 1, y: 0});
    engine.addItem('bush', {x: 2, y: 0});
    const state = engine.getState();
    const itemTypes = state.items.map(item => item.type);
    expect(itemTypes).toContain('tree');
  });
});
