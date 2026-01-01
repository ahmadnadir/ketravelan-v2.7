import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import TripDetails from "./pages/TripDetails";
import TripHub from "./pages/TripHub";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import Chat from "./pages/Chat";
import Expenses from "./pages/Expenses";
import DirectChat from "./pages/DirectChat";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import UserProfileView from "./pages/UserProfileView";
import Favourites from "./pages/Favourites";
import Approvals from "./pages/Approvals";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/trip/:id/hub" element={<TripHub />} />
            <Route path="/create" element={<CreateTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/chat/:id" element={<DirectChat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/user/:userId" element={<UserProfileView />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/install" element={<Install />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
