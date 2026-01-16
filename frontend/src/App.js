import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import ProjectDetail from "./pages/ProjectDetail";
import ArchitectureAnalysis from "./pages/ArchitectureAnalysis";
import CloudComparison from "./pages/CloudComparison";
import CostEstimation from "./pages/CostEstimation";
import RiskAnalysis from "./pages/RiskAnalysis";
import DiagramGenerator from "./pages/DiagramGenerator";
import DocumentExport from "./pages/DocumentExport";
import Templates from "./pages/Templates";
import FrameworkDetails from "./pages/FrameworkDetails";
import DiagramEditor from "./pages/DiagramEditor";
import ArchitectureScoring from "./pages/ArchitectureScoring";
import AnalysisHistory from "./pages/AnalysisHistory";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/analyze/:id" element={<ArchitectureAnalysis />} />
              <Route path="/cloud-comparison" element={<CloudComparison />} />
              <Route path="/cost-estimation/:id" element={<CostEstimation />} />
              <Route path="/risk-analysis/:id" element={<RiskAnalysis />} />
              <Route path="/diagrams/:id" element={<DiagramGenerator />} />
              <Route path="/diagram-editor/:id" element={<DiagramEditor />} />
              <Route path="/documents/:id" element={<DocumentExport />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/frameworks" element={<FrameworkDetails />} />
              <Route path="/scoring/:id" element={<ArchitectureScoring />} />
              <Route path="/history/:id" element={<AnalysisHistory />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </LanguageProvider>
  );
}

export default App;
