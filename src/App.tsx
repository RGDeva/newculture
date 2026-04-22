import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import NetworkPage from "./pages/NetworkPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import ApplyPage from "./pages/ApplyPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import AdminApplicationsPage from "./pages/AdminApplicationsPage.tsx";
import MixUploadPage from "./pages/MixUploadPage.tsx";
import MixSuccessPage from "./pages/MixSuccessPage.tsx";
import AuditCallPage from "./pages/AuditCallPage.tsx";
import MarketingPackagePage from "./pages/MarketingPackagePage.tsx";
import FreeAnalysisPage from "./pages/FreeAnalysisPage.tsx";
import VaultPage from "./pages/VaultPage.tsx";
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
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          {/* Productized offers */}
          <Route path="/mix" element={<MixUploadPage />} />
          <Route path="/mix/success" element={<MixSuccessPage />} />
          <Route path="/audit-call" element={<AuditCallPage />} />
          <Route path="/marketing-package" element={<MarketingPackagePage />} />
          <Route path="/free-analysis" element={<FreeAnalysisPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
