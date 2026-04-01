import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ArtistsPage from "./pages/ArtistsPage.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import NetworkPage from "./pages/NetworkPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import OpportunitiesPage from "./pages/OpportunitiesPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
