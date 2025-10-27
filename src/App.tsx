import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import StudentHome from "./pages/student/Home";
import ChatbotPage from "./pages/student/Chatbot";
import WellnessTracker from "./pages/student/WellnessTracker";
import PeerMentorship from "./pages/student/PeerMentorship";
import CrisisHelp from "./pages/student/CrisisHelp";
import AdminOverview from "./pages/admin/Overview";
import AdminHeatmap from "./pages/admin/Heatmap";
import AdminReports from "./pages/admin/Reports";
import AdminMentors from "./pages/admin/Mentors";
import CommunityPage from "./pages/student/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student Routes - Protected */}
            <Route path="/student" element={
              <ProtectedRoute >
                <DashboardLayout userType="student"><StudentHome /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/chatbot" element={
              <ProtectedRoute>
                <DashboardLayout userType="student"><ChatbotPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/wellness" element={
              <ProtectedRoute>
                <DashboardLayout userType="student"><WellnessTracker /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/mentorship" element={
              <ProtectedRoute>
                <DashboardLayout userType="student"><PeerMentorship /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/crisis" element={
              <ProtectedRoute>
                <DashboardLayout userType="student"><CrisisHelp /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/student/community" element={
              <ProtectedRoute>
                <DashboardLayout userType="student"><CommunityPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardLayout userType="admin"><AdminOverview /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/heatmap" element={
              <ProtectedRoute>
                <DashboardLayout userType="admin"><AdminHeatmap /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <DashboardLayout userType="admin"><AdminReports /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/mentors" element={
              <ProtectedRoute>
                <DashboardLayout userType="admin"><AdminMentors /></DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
