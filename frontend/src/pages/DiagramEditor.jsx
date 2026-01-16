import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import { 
  ArrowLeft,
  Save,
  Download,
  Trash2,
  Plus,
  Square,
  Circle,
  Diamond,
  Database,
  Server,
  Cloud,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Loader2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Pencil,
  Type,
  Palette,
  Layers,
  Copy,
  Clipboard,
  Grid3X3,
  Lock,
  Unlock,
  FileText,
  Monitor,
  Smartphone,
  Wifi,
  HardDrive,
  Cpu,
  Globe,
  Network,
  Container,
  Box,
  MessageSquare,
  Mail,
  Key,
  Settings,
  Cog,
  Activity,
  BarChart,
  PieChart,
  FileCode,
  Folder,
  GitBranch,
  Terminal,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Building,
  Warehouse
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Slider } from "../components/ui/slider";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Shape categories and types available in the editor
const shapeCategories = [
  {
    category: "infrastructure",
    label: { fr: "Infrastructure", en: "Infrastructure" },
    shapes: [
      { id: "server", icon: Server, label: { fr: "Serveur", en: "Server" }, color: "#8b5cf6" },
      { id: "database", icon: Database, label: { fr: "Base de données", en: "Database" }, color: "#6366f1" },
      { id: "cloud", icon: Cloud, label: { fr: "Cloud", en: "Cloud" }, color: "#06b6d4" },
      { id: "container", icon: Container, label: { fr: "Container", en: "Container" }, color: "#0ea5e9" },
      { id: "storage", icon: HardDrive, label: { fr: "Stockage", en: "Storage" }, color: "#64748b" },
      { id: "cpu", icon: Cpu, label: { fr: "Processeur", en: "Processor" }, color: "#f97316" },
      { id: "network", icon: Network, label: { fr: "Réseau", en: "Network" }, color: "#14b8a6" },
      { id: "warehouse", icon: Warehouse, label: { fr: "Data Center", en: "Data Center" }, color: "#6b7280" }
    ]
  },
  {
    category: "application",
    label: { fr: "Application", en: "Application" },
    shapes: [
      { id: "webapp", icon: Globe, label: { fr: "App Web", en: "Web App" }, color: "#3b82f6" },
      { id: "mobile", icon: Smartphone, label: { fr: "App Mobile", en: "Mobile App" }, color: "#ec4899" },
      { id: "desktop", icon: Monitor, label: { fr: "Desktop", en: "Desktop" }, color: "#8b5cf6" },
      { id: "api", icon: Zap, label: { fr: "API", en: "API" }, color: "#f59e0b" },
      { id: "microservice", icon: Box, label: { fr: "Microservice", en: "Microservice" }, color: "#10b981" },
      { id: "function", icon: FileCode, label: { fr: "Fonction", en: "Function" }, color: "#a855f7" },
      { id: "terminal", icon: Terminal, label: { fr: "CLI", en: "CLI" }, color: "#22c55e" }
    ]
  },
  {
    category: "security",
    label: { fr: "Sécurité", en: "Security" },
    shapes: [
      { id: "shield", icon: Shield, label: { fr: "Sécurité", en: "Security" }, color: "#ef4444" },
      { id: "key", icon: Key, label: { fr: "Auth/Clé", en: "Auth/Key" }, color: "#eab308" },
      { id: "lock", icon: Lock, label: { fr: "Verrou", en: "Lock" }, color: "#f97316" },
      { id: "firewall", icon: AlertTriangle, label: { fr: "Firewall", en: "Firewall" }, color: "#dc2626" }
    ]
  },
  {
    category: "users",
    label: { fr: "Utilisateurs", en: "Users" },
    shapes: [
      { id: "user", icon: User, label: { fr: "Utilisateur", en: "User" }, color: "#06b6d4" },
      { id: "users", icon: Users, label: { fr: "Groupe", en: "Group" }, color: "#ec4899" },
      { id: "building", icon: Building, label: { fr: "Organisation", en: "Organization" }, color: "#6366f1" }
    ]
  },
  {
    category: "communication",
    label: { fr: "Communication", en: "Communication" },
    shapes: [
      { id: "message", icon: MessageSquare, label: { fr: "Message Queue", en: "Message Queue" }, color: "#f59e0b" },
      { id: "email", icon: Mail, label: { fr: "Email", en: "Email" }, color: "#3b82f6" },
      { id: "wifi", icon: Wifi, label: { fr: "IoT/WiFi", en: "IoT/WiFi" }, color: "#14b8a6" }
    ]
  },
  {
    category: "devops",
    label: { fr: "DevOps", en: "DevOps" },
    shapes: [
      { id: "git", icon: GitBranch, label: { fr: "Git/VCS", en: "Git/VCS" }, color: "#f97316" },
      { id: "cicd", icon: Play, label: { fr: "CI/CD", en: "CI/CD" }, color: "#22c55e" },
      { id: "settings", icon: Settings, label: { fr: "Config", en: "Config" }, color: "#6b7280" },
      { id: "monitoring", icon: Activity, label: { fr: "Monitoring", en: "Monitoring" }, color: "#06b6d4" }
    ]
  },
  {
    category: "basic",
    label: { fr: "Formes de base", en: "Basic Shapes" },
    shapes: [
      { id: "rectangle", icon: Square, label: { fr: "Rectangle", en: "Rectangle" }, color: "#06b6d4" },
      { id: "circle", icon: Circle, label: { fr: "Cercle", en: "Circle" }, color: "#10b981" },
      { id: "diamond", icon: Diamond, label: { fr: "Losange", en: "Diamond" }, color: "#f59e0b" },
      { id: "folder", icon: Folder, label: { fr: "Dossier", en: "Folder" }, color: "#eab308" }
    ]
  },
  {
    category: "status",
    label: { fr: "État", en: "Status" },
    shapes: [
      { id: "success", icon: CheckCircle, label: { fr: "Succès", en: "Success" }, color: "#22c55e" },
      { id: "error", icon: XCircle, label: { fr: "Erreur", en: "Error" }, color: "#ef4444" },
      { id: "warning", icon: AlertTriangle, label: { fr: "Warning", en: "Warning" }, color: "#f59e0b" },
      { id: "timer", icon: Clock, label: { fr: "Timer", en: "Timer" }, color: "#6366f1" }
    ]
  }
];

// Flatten shape types for backward compatibility
const shapeTypes = shapeCategories.flatMap(cat => 
  cat.shapes.map(shape => ({
    ...shape,
    label: typeof shape.label === 'object' ? shape.label.en : shape.label,
    category: cat.category
  }))
);

// Initial empty canvas state
const initialState = {
  nodes: [],
  connections: [],
  selectedId: null
};

export default function DiagramEditor() {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const canvasRef = useRef(null);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Canvas state
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  
  // Tool state
  const [activeTool, setActiveTool] = useState("select"); // select, connect, pan
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(20);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Diagram title
  const [diagramTitle, setDiagramTitle] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${id}`);
      setProject(response.data);
      setDiagramTitle(`${response.data.name} - Architecture`);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error(language === 'fr' ? "Erreur de chargement" : "Loading error");
    } finally {
      setLoading(false);
    }
  };

  // Snap position to grid
  const snapToGridPosition = (x, y) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };

  // Add new node to canvas
  const addNode = (type) => {
    // Find shape in categories
    let shapeConfig = null;
    for (const category of shapeCategories) {
      const found = category.shapes.find(s => s.id === type);
      if (found) {
        shapeConfig = found;
        break;
      }
    }
    
    const label = shapeConfig 
      ? (language === 'fr' ? shapeConfig.label.fr : shapeConfig.label.en)
      : "Node";
    
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      x: 200 + Math.random() * 200,
      y: 150 + Math.random() * 100,
      width: type === "circle" ? 80 : 120,
      height: type === "circle" ? 80 : type === "diamond" ? 80 : 60,
      label: label,
      color: shapeConfig?.color || "#06b6d4",
      fontSize: 12
    };
    
    const position = snapToGridPosition(newNode.x, newNode.y);
    newNode.x = position.x;
    newNode.y = position.y;
    
    setNodes(prev => [...prev, newNode]);
    saveToHistory();
    toast.success(language === 'fr' ? "Élément ajouté" : "Element added");
  };

  // Delete selected node
  const deleteSelected = () => {
    if (selectedNode) {
      setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
      setConnections(prev => prev.filter(c => 
        c.from !== selectedNode.id && c.to !== selectedNode.id
      ));
      setSelectedNode(null);
      saveToHistory();
      toast.success(language === 'fr' ? "Élément supprimé" : "Element deleted");
    }
    if (selectedConnection) {
      setConnections(prev => prev.filter(c => c.id !== selectedConnection.id));
      setSelectedConnection(null);
      saveToHistory();
    }
  };

  // Save current state to history
  const saveToHistory = () => {
    const newState = { nodes: [...nodes], connections: [...connections] };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newState]);
    setHistoryIndex(prev => prev + 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setConnections(prevState.connections);
      setHistoryIndex(prev => prev - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setConnections(nextState.connections);
      setHistoryIndex(prev => prev + 1);
    }
  };

  // Handle mouse down on node
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    
    if (activeTool === "connect") {
      setConnectingFrom(node);
    } else {
      setSelectedNode(node);
      setSelectedConnection(null);
      setIsDragging(true);
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  // Handle mouse move on canvas
  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !selectedNode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let newX = e.clientX - rect.left - dragOffset.x;
    let newY = e.clientY - rect.top - dragOffset.y;
    
    const snapped = snapToGridPosition(newX, newY);
    
    setNodes(prev => prev.map(n => 
      n.id === selectedNode.id 
        ? { ...n, x: snapped.x, y: snapped.y }
        : n
    ));
  };

  // Handle mouse up
  const handleCanvasMouseUp = (e) => {
    if (connectingFrom) {
      // Find node under cursor
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const targetNode = nodes.find(n => 
        x >= n.x && x <= n.x + n.width &&
        y >= n.y && y <= n.y + n.height &&
        n.id !== connectingFrom.id
      );
      
      if (targetNode) {
        const newConnection = {
          id: `conn-${Date.now()}`,
          from: connectingFrom.id,
          to: targetNode.id,
          label: "",
          style: "solid" // solid, dashed, dotted
        };
        setConnections(prev => [...prev, newConnection]);
        saveToHistory();
        toast.success(language === 'fr' ? "Connexion créée" : "Connection created");
      }
      setConnectingFrom(null);
    }
    
    setIsDragging(false);
    if (selectedNode) {
      saveToHistory();
    }
  };

  // Handle canvas click (deselect)
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-bg')) {
      setSelectedNode(null);
      setSelectedConnection(null);
    }
  };

  // Update selected node property
  const updateNodeProperty = (property, value) => {
    if (!selectedNode) return;
    setNodes(prev => prev.map(n => 
      n.id === selectedNode.id ? { ...n, [property]: value } : n
    ));
    setSelectedNode(prev => ({ ...prev, [property]: value }));
  };

  // Generate SVG for export
  const generateSVG = () => {
    const padding = 50;
    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });
    
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect width="${width}" height="${height}" fill="#0f172a"/>`;
    
    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      if (fromNode && toNode) {
        const x1 = fromNode.x + fromNode.width / 2 - minX + padding;
        const y1 = fromNode.y + fromNode.height / 2 - minY + padding;
        const x2 = toNode.x + toNode.width / 2 - minX + padding;
        const y2 = toNode.y + toNode.height / 2 - minY + padding;
        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#64748b" stroke-width="2"/>`;
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const x = node.x - minX + padding;
      const y = node.y - minY + padding;
      
      if (node.type === "circle") {
        svg += `<circle cx="${x + node.width/2}" cy="${y + node.height/2}" r="${node.width/2}" fill="${node.color}" opacity="0.9"/>`;
      } else if (node.type === "diamond") {
        const cx = x + node.width/2;
        const cy = y + node.height/2;
        svg += `<polygon points="${cx},${y} ${x+node.width},${cy} ${cx},${y+node.height} ${x},${cy}" fill="${node.color}" opacity="0.9"/>`;
      } else {
        svg += `<rect x="${x}" y="${y}" width="${node.width}" height="${node.height}" rx="6" fill="${node.color}" opacity="0.9"/>`;
      }
      
      svg += `<text x="${x + node.width/2}" y="${y + node.height/2 + 4}" text-anchor="middle" fill="white" font-size="${node.fontSize}">${node.label}</text>`;
    });
    
    svg += '</svg>';
    return svg;
  };

  // Export as SVG
  const exportSVG = () => {
    const svg = generateSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramTitle.replace(/\s+/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(language === 'fr' ? "SVG exporté" : "SVG exported");
  };

  // Export as PDF
  const exportPDF = () => {
    const svg = generateSVG();
    
    // Create a canvas from SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Set canvas size with some padding
      canvas.width = img.width + 100;
      canvas.height = img.height + 100;
      
      // Fill background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image centered
      ctx.drawImage(img, 50, 50);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text(diagramTitle, 20, 30);
      
      // Add canvas as image
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Save PDF
      pdf.save(`${diagramTitle.replace(/\s+/g, '_')}.pdf`);
      
      URL.revokeObjectURL(svgUrl);
      toast.success(language === 'fr' ? "PDF exporté" : "PDF exported");
    };
    
    img.onerror = () => {
      toast.error(language === 'fr' ? "Erreur d'export PDF" : "PDF export error");
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  // Save diagram
  const saveDiagram = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/diagrams`, {
        project_id: id,
        title: diagramTitle,
        diagram_type: "custom",
        mermaid_code: JSON.stringify({ nodes, connections }),
        description: "Custom diagram created with drag-and-drop editor"
      });
      toast.success(language === 'fr' ? "Diagramme sauvegardé" : "Diagram saved");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(language === 'fr' ? "Erreur de sauvegarde" : "Save error");
    } finally {
      setSaving(false);
    }
  };

  // Render node based on type
  const renderNode = (node) => {
    const isSelected = selectedNode?.id === node.id;
    const baseClass = `absolute cursor-move transition-shadow ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-slate-900' : ''}`;
    
    const style = {
      left: node.x,
      top: node.y,
      width: node.width,
      height: node.height
    };

    if (node.type === "circle") {
      return (
        <div
          key={node.id}
          className={baseClass}
          style={{
            ...style,
            borderRadius: '50%',
            backgroundColor: node.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
        >
          <span className="text-white text-center px-2" style={{ fontSize: node.fontSize }}>
            {node.label}
          </span>
        </div>
      );
    }

    if (node.type === "diamond") {
      return (
        <div
          key={node.id}
          className={`${baseClass} flex items-center justify-center`}
          style={{
            ...style,
            transform: 'rotate(45deg)',
            backgroundColor: node.color,
          }}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
        >
          <span 
            className="text-white text-center" 
            style={{ fontSize: node.fontSize, transform: 'rotate(-45deg)' }}
          >
            {node.label}
          </span>
        </div>
      );
    }

    // Default rectangle
    return (
      <div
        key={node.id}
        className={`${baseClass} rounded-lg flex items-center justify-center`}
        style={{
          ...style,
          backgroundColor: node.color,
        }}
        onMouseDown={(e) => handleNodeMouseDown(e, node)}
      >
        <span className="text-white text-center px-2" style={{ fontSize: node.fontSize }}>
          {node.label}
        </span>
      </div>
    );
  };

  // Render connection line
  const renderConnection = (conn) => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    if (!fromNode || !toNode) return null;

    const x1 = fromNode.x + fromNode.width / 2;
    const y1 = fromNode.y + fromNode.height / 2;
    const x2 = toNode.x + toNode.width / 2;
    const y2 = toNode.y + toNode.height / 2;

    const isSelected = selectedConnection?.id === conn.id;

    return (
      <g key={conn.id} onClick={() => { setSelectedConnection(conn); setSelectedNode(null); }}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isSelected ? "#06b6d4" : "#64748b"}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={conn.style === "dashed" ? "5,5" : conn.style === "dotted" ? "2,2" : "none"}
          markerEnd="url(#arrowhead)"
          style={{ cursor: 'pointer' }}
        />
        {conn.label && (
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
          >
            {conn.label}
          </text>
        )}
      </g>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in" data-testid="diagram-editor">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/diagrams/${id}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading font-bold text-2xl text-white">
              {language === 'fr' ? 'Éditeur de Diagrammes' : 'Diagram Editor'}
            </h1>
            <p className="text-slate-400 text-sm">{project?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportSVG}>
            <Download className="w-4 h-4 mr-1" />
            SVG
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF}>
            <FileText className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button className="btn-primary" onClick={saveDiagram} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            {language === 'fr' ? 'Sauvegarder' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Left Toolbar - Shapes */}
        <Card className="card-tech lg:col-span-1">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              {language === 'fr' ? 'Bibliothèque' : 'Library'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Shape Categories */}
            {shapeCategories.map((category) => (
              <div key={category.category} className="mb-4">
                <p className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">
                  {language === 'fr' ? category.label.fr : category.label.en}
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {category.shapes.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => addNode(shape.id)}
                      className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors flex flex-col items-center gap-1 group"
                      title={language === 'fr' ? shape.label.fr : shape.label.en}
                    >
                      <shape.icon className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: shape.color }} />
                      <span className="text-[10px] text-slate-400 truncate w-full text-center">
                        {language === 'fr' ? shape.label.fr : shape.label.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Tools */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500 mb-2">{language === 'fr' ? 'Outils' : 'Tools'}</p>
              <div className="flex gap-1">
                <Button
                  variant={activeTool === "select" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTool("select")}
                  title="Select"
                >
                  <MousePointer className="w-4 h-4" />
                </Button>
                <Button
                  variant={activeTool === "connect" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTool("connect")}
                  title="Connect"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteSelected}
                  disabled={!selectedNode && !selectedConnection}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Canvas Options */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500 mb-2">{language === 'fr' ? 'Options' : 'Options'}</p>
              <div className="space-y-2">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`flex items-center gap-2 w-full p-2 rounded text-xs ${showGrid ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  {language === 'fr' ? 'Grille' : 'Grid'}
                </button>
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`flex items-center gap-2 w-full p-2 rounded text-xs ${snapToGrid ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}
                >
                  {snapToGrid ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {language === 'fr' ? 'Aligner' : 'Snap'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="card-tech lg:col-span-3 overflow-hidden">
          <CardHeader className="py-2 border-b border-white/5">
            <div className="flex items-center justify-between">
              <Input
                value={diagramTitle}
                onChange={(e) => setDiagramTitle(e.target.value)}
                className="bg-transparent border-none text-white font-medium max-w-xs"
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-slate-400 w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(200, z + 10))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={canvasRef}
              className="relative bg-slate-900 overflow-hidden canvas-bg"
              style={{ 
                height: '500px',
                backgroundImage: showGrid 
                  ? `radial-gradient(circle, #334155 1px, transparent 1px)`
                  : 'none',
                backgroundSize: `${gridSize}px ${gridSize}px`,
                cursor: activeTool === "connect" ? "crosshair" : isDragging ? "grabbing" : "default"
              }}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              {/* SVG for connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                <g style={{ pointerEvents: 'auto' }}>
                  {connections.map(renderConnection)}
                </g>
              </svg>
              
              {/* Nodes */}
              <div 
                className="absolute inset-0"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left'
                }}
              >
                {nodes.map(renderNode)}
              </div>
              
              {/* Empty state */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>{language === 'fr' ? 'Cliquez sur une forme pour commencer' : 'Click a shape to start'}</p>
                  </div>
                </div>
              )}
              
              {/* Connecting indicator */}
              {connectingFrom && (
                <div className="absolute top-2 left-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                  {language === 'fr' ? 'Cliquez sur un autre élément pour connecter' : 'Click another element to connect'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Properties */}
        <Card className="card-tech lg:col-span-1">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Pencil className="w-4 h-4 text-primary" />
              {language === 'fr' ? 'Propriétés' : 'Properties'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-400">Label</Label>
                  <Input
                    value={selectedNode.label}
                    onChange={(e) => updateNodeProperty('label', e.target.value)}
                    className="input-tech mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-slate-400">
                    {language === 'fr' ? 'Couleur' : 'Color'}
                  </Label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'].map(color => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded ${selectedNode.color === color ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateNodeProperty('color', color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-slate-400">
                    {language === 'fr' ? 'Taille police' : 'Font size'}: {selectedNode.fontSize}px
                  </Label>
                  <Slider
                    value={[selectedNode.fontSize]}
                    onValueChange={([v]) => updateNodeProperty('fontSize', v)}
                    min={8}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-slate-400">W</Label>
                    <Input
                      type="number"
                      value={selectedNode.width}
                      onChange={(e) => updateNodeProperty('width', parseInt(e.target.value) || 60)}
                      className="input-tech mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">H</Label>
                    <Input
                      type="number"
                      value={selectedNode.height}
                      onChange={(e) => updateNodeProperty('height', parseInt(e.target.value) || 40)}
                      className="input-tech mt-1"
                    />
                  </div>
                </div>

                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  onClick={deleteSelected}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {language === 'fr' ? 'Supprimer' : 'Delete'}
                </Button>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                <MousePointer className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {language === 'fr' 
                    ? 'Sélectionnez un élément pour modifier ses propriétés' 
                    : 'Select an element to edit properties'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
