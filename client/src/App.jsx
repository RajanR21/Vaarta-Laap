import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
// const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const user = true;
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectRoute user={user} redirect="/login">
                <Home />
              </ProtectRoute>
            }
          >
            <Route
              path="/chat/:chatId"
              element={
                <ProtectRoute user={user} redirect="/login">
                  <Chat />
                </ProtectRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectRoute user={user} redirect="/login">
                  <Groups />
                </ProtectRoute>
              }
            />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
