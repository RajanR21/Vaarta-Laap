import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.js";
import miscSlice from "./reducers/misc.js";
import chatSlice from "./reducers/chat.js";
import api from "./api/api";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },

  middleware: (mid) => [...mid(), api.middleware],
});

export default store;
