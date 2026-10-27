import { createSlice } from '@reduxjs/toolkit'
// apiThunk renews the access token as needed and logs out when the session has ended
import { apiThunk, logout } from './authSlice'

export const fetchItems = apiThunk("items/fetchList", (params) => ({
  path: `/api/items?${new URLSearchParams(params)}`
}));

export const fetchItemById = apiThunk("items/fetchOne", (id) => ({
  path: `/api/items/${id}`
}));

export const createItem = apiThunk("items/create", (data) => ({
  path: "/api/items", method: "POST", body: data
}), (result) => result.item);

export const updateItem = apiThunk("items/update", ({ id, data }) => ({
  path: `/api/items/${id}`, method: "PUT", body: data
}), (result) => result.item);

export const deleteItem = apiThunk("items/delete", (id) => ({
  path: `/api/items/${id}`, method: "DELETE"
}), (_result, id) => id);

const initialState = {
  list: { items: [], total: 0, page: 1, pages: 1, categories: [] },
  listStatus: "idle",
  listError: null,
  listRequestId: null,
  current: null,
  currentStatus: "idle",
  currentError: null,
  saving: false,
  saveError: null,
  deleteError: null
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearItemErrors(state) {
      state.listError = null;
      state.currentError = null;
      state.saveError = null;
      state.deleteError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // List: only the latest request may update state (avoids out-of-order search results)
      .addCase(fetchItems.pending, (state, action) => {
        state.listStatus = "loading";
        state.listError = null;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.listRequestId) return;
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        if (action.meta.requestId !== state.listRequestId) return;
        state.listStatus = "failed";
        state.listError = action.payload || action.error.message;
      })

      // Single item (detail + edit pages)
      .addCase(fetchItemById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
        state.current = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload || action.error.message;
      })

      // Delete
      .addCase(deleteItem.pending, (state) => {
        state.deleteError = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const id = action.payload;
        state.list.items = state.list.items.filter((item) => item._id !== id);
        state.list.total = Math.max(state.list.total - 1, 0);
        if (state.current?._id === id) state.current = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.deleteError = action.payload || action.error.message;
      })

      // Clear everything on logout so the next user starts fresh
      .addCase(logout, () => initialState);

    // Create + update share the same saving state
    [createItem, updateItem].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.saving = true;
          state.saveError = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          const item = action.payload;
          state.saving = false;
          state.current = item;
          state.currentStatus = "succeeded";
          const index = state.list.items.findIndex((i) => i._id === item._id);
          if (index !== -1) state.list.items[index] = item;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.saving = false;
          state.saveError = action.payload || action.error.message;
        });
    });
  }
});

export const { clearItemErrors } = itemsSlice.actions;

export const selectItemsState = (state) => state.items;

export default itemsSlice.reducer;
