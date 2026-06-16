import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Chatbot from "./components/ui/Chatbot";
import About from "./pages/About";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import DataDeletion from "@/pages/DataDeletion";
import FreeTrial from "./pages/free-trial";
import TrialSuccess from './pages/trial-success';
import Pricing from "./pages/Pricing";

import CalendarAddPage from "@/pages/CalendarAddPage";
import ReschedulePage from "@/pages/ReschedulePage";

// Solutions pages
import SolutionsOverview from "./pages/Solutions/SolutionsOverview";
import CategoryOverview from "./pages/Solutions/CategoryOverview";

// CRM Solutions
import OrganizeCustomers from "./pages/Solutions/CRM/OrganizeCustomers";
import OnlineBooking from "./pages/Solutions/CRM/OnlineBooking";
import CustomerPortal from "./pages/Solutions/CRM/CustomerPortal";
import BusinessAutomation from "./pages/Solutions/CRM/BusinessAutomation";

// Sales Solutions
import SalesPipeline from "./pages/Solutions/Sales/SalesPipeline";
import ConvertUpsell from "./pages/Solutions/Sales/ConvertUpsell";
import GetPaidFaster from "./pages/Solutions/Sales/GetPaidFaster";
import ProposalKit from "./pages/Solutions/Sales/ProposalKit";

// Job Management Solutions
import SchedulingDispatching from "./pages/Solutions/Jobs/SchedulingDispatching";
import JobCosting from "./pages/Solutions/Jobs/JobCosting";
import MobileManagement from "./pages/Solutions/Jobs/MobileManagement";
import WorkflowIntegration from "./pages/Solutions/Jobs/WorkflowIntegration";

// Marketing Solutions
import MarketingAutomation from "./pages/Solutions/Marketing/Automation";
import SmsEmail from "./pages/Solutions/Marketing/SmsEmail";
import Voicemail from "./pages/Solutions/Marketing/Voicemail";
import Reviews from "./pages/Solutions/Marketing/Reviews";

// Legacy Service Pages
import WebsiteDevelopment from "./pages/Services/WebsiteDevelopment";
import AdvancedSEO from "./pages/Services/AdvancedSEO";
import AIAgents from "./pages/Services/AIAgents";
import Automation from "./pages/Services/Automation";
import Integration from "./pages/Services/Integration";
import PerformanceOptimization from "./pages/Services/PerformanceOptimization";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/free-trial" element={<FreeTrial />} />
          <Route path="/trial-success" element={<TrialSuccess />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Legacy Service Routes (keeping for backward compatibility) */}
          <Route path="/services/website-development" element={<WebsiteDevelopment />} />
          <Route path="/services/advanced-seo" element={<AdvancedSEO />} />
          <Route path="/services/ai-agents" element={<AIAgents />} />
          <Route path="/services/automation" element={<Automation />} />
          <Route path="/services/integration" element={<Integration />} />
          <Route path="/services/performance-optimization" element={<PerformanceOptimization />} />
          
          {/* New Solutions Routes */}
          <Route path="/solutions" element={<SolutionsOverview />} />
          <Route path="/solutions/:category" element={<CategoryOverview />} />
          
          {/* CRM Solutions */}
          <Route path="/solutions/crm/organize-customers" element={<OrganizeCustomers />} />
          <Route path="/solutions/crm/online-booking" element={<OnlineBooking />} />
          <Route path="/solutions/crm/customer-portal" element={<CustomerPortal />} />
          <Route path="/solutions/crm/business-automation" element={<BusinessAutomation />} />
          
          {/* Sales Solutions */}
          <Route path="/solutions/sales/sales-pipeline" element={<SalesPipeline />} />
          <Route path="/solutions/sales/convert-upsell" element={<ConvertUpsell />} />
          <Route path="/solutions/sales/get-paid-faster" element={<GetPaidFaster />} />
          <Route path="/solutions/sales/proposal-kit" element={<ProposalKit />} />
          
          {/* Job Management Solutions */}
          <Route path="/solutions/jobs/scheduling-dispatching" element={<SchedulingDispatching />} />
          <Route path="/solutions/jobs/job-costing" element={<JobCosting />} />
          <Route path="/solutions/jobs/mobile-management" element={<MobileManagement />} />
          <Route path="/solutions/jobs/workflow-integration" element={<WorkflowIntegration />} />
          
          {/* Marketing Solutions */}
          <Route path="/solutions/marketing/automation" element={<MarketingAutomation />} />
          <Route path="/solutions/marketing/sms-email" element={<SmsEmail />} />
          <Route path="/solutions/marketing/voicemail" element={<Voicemail />} />
          <Route path="/solutions/marketing/reviews" element={<Reviews />} />
          
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/calendar" element={<CalendarAddPage />} />
          <Route path="/reschedule" element={<ReschedulePage />} />

        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
