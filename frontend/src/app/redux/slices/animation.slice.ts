import { createSlice } from "@reduxjs/toolkit";

const initialState: { isAnimated: boolean } = {
  isAnimated: sessionStorage.getItem("isAnimationCompleted") === "true",
};

const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    setIsAnimated: (state) => {
      state.isAnimated = true;
      sessionStorage.setItem("isAnimationCompleted", "true");
    },
  },
});

export const { setIsAnimated } = animationSlice.actions;
export default animationSlice.reducer;
