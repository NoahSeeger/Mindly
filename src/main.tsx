import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import Daily_Entry from "./Daily_Entry";
import Templates from "./Templates";
import History from "./History";
import Settings from "./Settings";
import { BottomNavbar } from "./components/Navbar";

//imoprt dotenv

import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: import.meta.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.REACT_APP_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <BrowserRouter>
          <BottomNavbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily_entry" element={<Daily_Entry />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PostHogProvider>
  </StrictMode>
);
