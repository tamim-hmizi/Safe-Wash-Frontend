import { createSlice } from "@reduxjs/toolkit";

// Initial state of the user object
const initialState = {
  email: "",
  phone: "",
  name: "",
  lastName: "",
  role: "user",
};

// Redux slice for managing user state
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the user state
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.name = action.payload.name;
      state.lastName = action.payload.lastName;
      state.role = action.payload.role;
    },
    // Action to clear the user state (e.g., for logout)
    clearUser: (state) => {
      state.email = "";
      state.phone = "";
      state.name = "";
      state.lastName = "";
      state.role = "user";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
