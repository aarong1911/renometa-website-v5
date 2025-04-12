
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WebsiteDevelopment from "./pages/Services/WebsiteDevelopment";
import AdvancedSEO from "./pages/Services/AdvancedSEO";
import AIAgents from "./pages/Services/AIAgents";
import Automation from "./pages/Services/Automation";
import Integration from "./pages/Services/Integration";
import PerformanceOptimization from "./pages/Services/PerformanceOptimization";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Chatbot from "./components/ui/Chatbot";
import About from "./pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services/website-development" element={<WebsiteDevelopment />} />
          <Route path="/services/advanced-seo" element={<AdvancedSEO />} />
          <Route path="/services/ai-agents" element={<AIAgents />} />
          <Route path="/services/automation" element={<Automation />} />
          <Route path="/services/integration" element={<Integration />} />
          <Route path="/services/performance-optimization" element={<PerformanceOptimization />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
