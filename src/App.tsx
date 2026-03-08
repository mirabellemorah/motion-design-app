import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import WelcomePage from "@/pages/WelcomePage";
import HomePage from "@/pages/HomePage";
import LessonsPage from "@/pages/LessonsPage";
import LessonDetailPage from "@/pages/LessonDetailPage";
import PracticePage from "@/pages/PracticePage";
import ProgressPage from "@/pages/ProgressPage";
import BrandCurvesPage from "@/pages/BrandCurvesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mx-auto max-w-lg min-h-screen">
          <Routes>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lesson/:id" element={<LessonDetailPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice/:id" element={<PracticePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/brands" element={<BrandCurvesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
