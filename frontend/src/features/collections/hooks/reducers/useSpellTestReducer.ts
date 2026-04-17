type SpellTestStateType = {
  index: number;
};

type SpellTestActionsType = { type: "INCREMENT_INDEX" };

export const initialState: SpellTestStateType = {
  index: 0,
};

export function spellTestReducer(
  state: SpellTestStateType,
  action: SpellTestActionsType,
): SpellTestStateType {
  switch (action.type) {
    case "INCREMENT_INDEX":
      return { ...state, index: state.index + 1 };
    default:
      return state;
  }
}
