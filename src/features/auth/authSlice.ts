import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, setAccessToken } from "@/lib/api";
import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  const refresh = await api.post<{ accessToken: string }>("/auth/refresh");
  setAccessToken(refresh.accessToken);
  const { user } = await api.get<{ user: AuthUser }>("/auth/me");
  return user;
});

export const login = createAsyncThunk(
  "auth/login",
  async ({ phone, password }: { phone: string; password: string }) => {
    const res = await api.postForm<{ accessToken: string; user: AuthUser }>("/auth/login", {
      phone,
      password,
    });
    setAccessToken(res.accessToken);
    return res.user;
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
  setAccessToken(null);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = "unauthenticated";
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.user = null;
        state.error = action.error.message ?? "Could not sign in";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "unauthenticated";
        state.user = null;
      });
  },
});

export default authSlice.reducer;
