import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./screens/HomePage"; 
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "./theme";
import { createTheme } from "@mui/material/styles";
import ProfilePage from "./screens/ProfilePage";
import { IAppState } from "state";
import LoginPage from "./screens/loginPage/LoginPage";
import { Toaster } from "sonner";


function App() {
  const mode = useSelector((state: IAppState) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state: IAppState) => state.token));
  return (
    <div className="app">
      <Toaster/>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to={"/"} />}
            />
            
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
