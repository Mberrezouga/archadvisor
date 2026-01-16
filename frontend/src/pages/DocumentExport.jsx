import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { 
  FileText, 
  ArrowLeft,
  Loader2,
  Download,
  FileJson,
  File,
  Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const templateTypes = [
  {
    id: "togaf",
    name: "TOGAF ADM",
    description: "Template standard TOGAF Architecture Development Method",
    sections: ["Vision", "Business Architecture", "Data Architecture", "Application Architecture", "Technology Architecture", "Migration Planning", "Governance"]
  },
  {
    id: "archimate",
    name: "ArchiMate",
    description: "Template basé sur le langage ArchiMate",
    sections: ["Motivation", "Strategy", "Business", "Application", "Technology", "Implementation"]
  },
  {
    id: "custom",
    name: "Personnalisé",
    description: "Template flexible pour documentation générale",
    sections: ["Overview", "Requirements", "Architecture", "Security", "Deployment", "Operations"]
  }
];

export default function DocumentExport() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("togaf");
  const [generatedDoc, setGeneratedDoc] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, docsRes] = await Promise.all([
        axios.get(`${API}/projects/${id}`),
        axios.get(`${API}/documents/${id}`)
      ]);
      setProject(projectRes.data);
      setDocuments(docsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleGenerateTemplate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/documents`, {
        project_id: id,
        template_type: selectedTemplate
      });
      setGeneratedDoc(response.data);
      setDocuments(prev => [response.data, ...prev]);
      toast.success("Document généré!");
    } catch (error) {
      console.error("Error generating:", error);
      toast.error("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/documents/ai-generate`, {
        project_id: id,
        template_type: selectedTemplate
      });
      setGeneratedDoc(response.data);
      setDocuments(prev => [response.data, ...prev]);
      toast.success("Document IA généré!");
    } catch (error) {
      console.error("Error generating:", error);
      toast.error("Erreur lors de la génération IA");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!generatedDoc) return;

    const doc = new jsPDF();
    const content = generatedDoc.content;
    
    doc.setFontSize(20);
    doc.text(generatedDoc.title, 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    
    if (content.ai_content) {
      const lines = doc.splitTextToSize(content.ai_content, 170);
      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 7;
      });
    } else if (content.sections) {
      Object.entries(content.sections).forEach(([key, section]) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.text(section.title, 20, y);
        y += 10;
        doc.setFontSize(10);
        doc.text(section.content, 20, y);
        y += 15;
      });
    }

    doc.save(`${generatedDoc.title.replace(/\s+/g, '_')}.pdf`);
    toast.success("PDF exporté!");
  };

  const exportToWord = async () => {
    if (!generatedDoc) return;

    const content = generatedDoc.content;
    const children = [
      new Paragraph({
        text: generatedDoc.title,
        heading: HeadingLevel.TITLE
      })
    ];

    if (content.ai_content) {
      content.ai_content.split('\n').forEach(line => {
        children.push(new Paragraph({
          children: [new TextRun(line)]
        }));
      });
    } else if (content.sections) {
      Object.entries(content.sections).forEach(([key, section]) => {
        children.push(new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1
        }));
        children.push(new Paragraph({
          children: [new TextRun(section.content)]
        }));
      });
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${generatedDoc.title.replace(/\s+/g, '_')}.docx`);
    toast.success("Word exporté!");
  };

  const exportToMarkdown = () => {
    if (!generatedDoc) return;

    const content = generatedDoc.content;
    let md = `# ${generatedDoc.title}\n\n`;
    
    if (content.ai_content) {
      md += content.ai_content;
    } else if (content.sections) {
      Object.entries(content.sections).forEach(([key, section]) => {
        md += `## ${section.title}\n\n${section.content}\n\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown" });
    saveAs(blob, `${generatedDoc.title.replace(/\s+/g, '_')}.md`);
    toast.success("Markdown exporté!");
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="document-export">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={`/projects/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-3xl text-white">
            {t.docs.title}
          </h1>
          <p className="text-slate-400">{project?.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <div className="space-y-6">
          <Card className="card-tech">
            <CardHeader>
              <CardTitle className="font-heading text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t.docs.chooseTemplate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedTemplate} 
                onValueChange={setSelectedTemplate}
                className="space-y-4"
              >
                {templateTypes.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                    data-testid={`template-${template.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={template.id} className="text-white font-medium cursor-pointer">
                          {template.name}
                        </Label>
                        <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {template.sections.slice(0, 4).map((section) => (
                            <span 
                              key={section}
                              className="text-xs px-2 py-1 rounded bg-muted text-slate-400"
                            >
                              {section}
                            </span>
                          ))}
                          {template.sections.length > 4 && (
                            <span className="text-xs px-2 py-1 rounded bg-muted text-slate-400">
                              +{template.sections.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateTemplate}
              className="btn-secondary flex-1"
              disabled={loading}
              data-testid="generate-template-btn"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  {t.docs.generateTemplate}
                </>
              )}
            </Button>
            <Button 
              onClick={handleGenerateAI}
              className="btn-primary flex-1"
              disabled={loading}
              data-testid="generate-ai-doc-btn"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t.docs.generateAI}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview & Export */}
        <div className="space-y-6">
          <Card className="card-tech">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="font-heading text-white">
                {t.docs.generatedDoc}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {generatedDoc ? (
                <div className="space-y-4">
                  <h3 className="font-heading font-medium text-white text-lg">
                    {generatedDoc.title}
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none max-h-[300px] overflow-y-auto">
                    {generatedDoc.content.ai_content ? (
                      <div className="whitespace-pre-wrap text-slate-300">
                        {generatedDoc.content.ai_content}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {generatedDoc.content.sections && Object.entries(generatedDoc.content.sections).map(([key, section]) => (
                          <div key={key}>
                            <h4 className="text-primary font-medium">{section.title}</h4>
                            <p className="text-slate-400 text-sm">{section.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-400">
                    {t.docs.selectTemplatePrompt}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Buttons */}
          {generatedDoc && (
            <Card className="card-tech">
              <CardHeader>
                <CardTitle className="font-heading text-white text-lg flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  {t.docs.export}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={exportToPDF}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    data-testid="export-pdf-btn"
                  >
                    <File className="w-6 h-6 text-red-400" />
                    <span>PDF</span>
                  </Button>
                  <Button
                    onClick={exportToWord}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    data-testid="export-word-btn"
                  >
                    <FileText className="w-6 h-6 text-blue-400" />
                    <span>Word</span>
                  </Button>
                  <Button
                    onClick={exportToMarkdown}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    data-testid="export-md-btn"
                  >
                    <FileJson className="w-6 h-6 text-emerald-400" />
                    <span>Markdown</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Previous Documents */}
          {documents.length > 0 && (
            <Card className="card-tech">
              <CardHeader>
                <CardTitle className="font-heading text-white text-lg">
                  {t.docs.previousDocs}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setGeneratedDoc(doc)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        generatedDoc?.id === doc.id
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <p className="font-medium text-white text-sm">{doc.title}</p>
                      <p className="text-xs text-slate-500 uppercase">{doc.template_type}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
