import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Landing from "./pages/Landing.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Modules from "./pages/Modules.tsx";
import ModuleDetail from "./pages/ModuleDetail.tsx";
import SubtopicLearn from "./pages/SubtopicLearn.tsx";
import FlashcardsPage from "./pages/Flashcards.tsx";
import Quiz from "./pages/Quiz.tsx";
import StudyPlan from "./pages/StudyPlan.tsx";
import Notes from "./pages/Notes.tsx";
import Glossary from "./pages/Glossary.tsx";
import Admin from "./pages/Admin.tsx";
import { AppLayout } from "./components/AppLayout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/module" element={<Modules />} />
              <Route path="/module/:moduleId" element={<ModuleDetail />} />
              <Route path="/module/:moduleId/:subtopicId" element={<SubtopicLearn />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/pruefung" element={<Quiz />} />
              <Route path="/lernplan" element={<StudyPlan />} />
              <Route path="/glossar" element={<Glossary />} />
              <Route path="/notizen" element={<Notes />} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
