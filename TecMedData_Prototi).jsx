import React, { useState } from "react";
import {
  Search, Bell, User, ArrowLeft, MapPin, Calendar, Wrench, FileText,
  Download, MessageSquare, Plus, X, Check, ScanLine, Filter, Cpu,
  AlertTriangle, ChevronRight, BookOpen, ClipboardList, Send, Camera,
  Loader2, CheckCircle2, QrCode, UploadCloud, PenLine
} from "lucide-react";

/* ---------------------------------------------------------------- */
/* MOCK DATA — datos de ejemplo, todo vive en memoria (sin backend)  */
/* ---------------------------------------------------------------- */

const STATUS = {
  available: { label: "Disponible", bg: "#DCFCE7", color: "#16A34A", dot: "#22C55E" },
  maintenance: { label: "Mantenimiento", bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" },
  "in-use": { label: "En Uso", bg: "#FEF3C7", color: "#B45309", dot: "#F59E0B" },
  offline: { label: "Fuera de Servicio", bg: "#E5E7EB", color: "#4B5563", dot: "#9CA3AF" },
};

const INITIAL_EQUIPMENT = [
  { id: "EQ-CT-001", name: "CT Scanner", model: "SOMATOM Drive", manufacturer: "Siemens Healthineers", year: 2022, serial: "SOM-2024-4471", status: "available", location: "Ala de Radiología A", department: "Imagenología Diagnóstica", online: true,
    specs: { "Cortes": "128 cortes", "Gantry": "78 cm de diámetro", "Rotación": "0.25 s/rot", "Rango kVp": "70–150 kVp" },
    lastMaint: "2025-06-12", nextMaint: "2025-09-12" },
  { id: "EQ-PET-002", name: "PET/CT Scanner", model: "Biograph Vision 600", manufacturer: "Siemens Healthineers", year: 2021, serial: "BIO-2023-1187", status: "maintenance", location: "Laboratorio de Medicina Nuclear", department: "Medicina Nuclear", online: false,
    specs: { "Detectores": "Digital LSO", "Campo de vista": "78 cm", "Resolución": "3.2 mm" },
    lastMaint: "2025-05-02", nextMaint: "2025-08-02" },
  { id: "EQ-MRI-003", name: "MRI System", model: "MAGNETOM Vida", manufacturer: "Siemens Healthineers", year: 2023, serial: "MAG-2024-0093", status: "in-use", location: "Suite de Imagenología B", department: "Imagenología Diagnóstica", online: true,
    specs: { "Campo": "3 Tesla", "Bore": "70 cm", "Gradiente": "45 mT/m" },
    lastMaint: "2025-04-18", nextMaint: "2025-10-18" },
  { id: "EQ-CT-004", name: "CT Scanner", model: "Revolution Apex", manufacturer: "GE HealthCare", year: 2020, serial: "REV-2022-3350", status: "available", location: "Urgencias", department: "Emergencias", online: true,
    specs: { "Cortes": "256 cortes", "Gantry": "80 cm de diámetro", "Rotación": "0.23 s/rot" },
    lastMaint: "2025-03-01", nextMaint: "2025-09-01" },
  { id: "EQ-PET-005", name: "PET Scanner", model: "Vereos Digital PET", manufacturer: "Philips", year: 2019, serial: "VER-2021-7742", status: "available", location: "Centro de Oncología", department: "Oncología", online: true,
    specs: { "Detectores": "SiPM digital", "Campo de vista": "76 cm" },
    lastMaint: "2025-02-20", nextMaint: "2025-08-20" },
];

const INITIAL_MANUALS = [
  { id: "M1", equipmentId: "EQ-CT-001", title: "Manual de Operación — SOMATOM Drive", manufacturer: "Siemens Healthineers", type: "Operación", pages: 118, size: "8.4 MB" },
  { id: "M2", equipmentId: "EQ-CT-001", title: "Manual de Servicio — SOMATOM Drive", manufacturer: "Siemens Healthineers", type: "Servicio", pages: 64, size: "5.1 MB" },
  { id: "M3", equipmentId: "EQ-PET-002", title: "Manual de Operación — Biograph Vision 600", manufacturer: "Siemens Healthineers", type: "Operación", pages: 142, size: "11.2 MB" },
  { id: "M4", equipmentId: "EQ-MRI-003", title: "Manual de Operación — MAGNETOM Vida", manufacturer: "Siemens Healthineers", type: "Operación", pages: 201, size: "16.7 MB" },
  { id: "M5", equipmentId: "EQ-CT-004", title: "Manual de Operación — Revolution Apex", manufacturer: "GE HealthCare", type: "Operación", pages: 96, size: "7.3 MB" },
  { id: "M6", equipmentId: "EQ-CT-004", title: "Manual de Servicio — Revolution Apex", manufacturer: "GE HealthCare", type: "Servicio", pages: 58, size: "4.6 MB" },
  { id: "M7", equipmentId: "EQ-PET-005", title: "Manual de Operación — Vereos Digital PET", manufacturer: "Philips", type: "Operación", pages: 88, size: "6.9 MB" },
];

const INITIAL_MAINT = [
  { id: "F1", equipmentId: "EQ-CT-001", date: "2025-06-12", type: "Preventivo", technician: "Ing. Laura Salinas", location: "Ala de Radiología A", reason: "", activities: "Limpieza de gantry, verificación de alineación de haz, prueba de calidad de imagen.", parts: "Ninguna", result: "Aprobado", nextDate: "2025-09-12", source: "Captura manual", folio: "MT-0231" },
  { id: "F2", equipmentId: "EQ-PET-002", date: "2025-07-18", type: "Correctivo", technician: "Ing. Diego Reyes", location: "Laboratorio de Medicina Nuclear", reason: "Falla en detector, imagen con ruido excesivo reportada por usuario.", activities: "Reemplazo de módulo detector 4B, recalibración de coincidencia.", parts: "Módulo detector LSO (1)", result: "Requiere seguimiento", nextDate: "2025-07-25", source: "Escaneado (OCR)", folio: "MT-0244" },
  { id: "F3", equipmentId: "EQ-MRI-003", date: "2025-04-18", type: "Calibración", technician: "Ing. Laura Salinas", location: "Suite de Imagenología B", reason: "", activities: "Calibración de homogeneidad de campo, verificación de gradientes.", parts: "Ninguna", result: "Aprobado", nextDate: "2025-10-18", source: "Captura manual", folio: "MT-0198" },
  { id: "F4", equipmentId: "EQ-CT-004", date: "2025-03-01", type: "Preventivo", technician: "Ing. Marco Villarreal", location: "Urgencias", reason: "", activities: "Revisión de sistema de enfriamiento, prueba de disparo de tubo de rayos X.", parts: "Filtro de aire (1)", result: "Aprobado", nextDate: "2025-09-01", source: "Escaneado (OCR)", folio: "MT-0205" },
  { id: "F5", equipmentId: "EQ-PET-005", date: "2025-02-20", type: "Preventivo", technician: "Ing. Diego Reyes", location: "Centro de Oncología", reason: "", activities: "Verificación de detectores, prueba de uniformidad.", parts: "Ninguna", result: "Aprobado", nextDate: "2025-08-20", source: "Captura manual", folio: "MT-0187" },
];

const INITIAL_COMMENTS = [
  { id: "C1", equipmentId: "EQ-CT-001", author: "Ing. Laura Salinas", date: "2025-07-14 09:20", text: "El panel táctil tarda un par de segundos en responder al encender. No afecta la operación, dar seguimiento en el próximo preventivo." },
  { id: "C2", equipmentId: "EQ-PET-002", author: "Ing. Diego Reyes", date: "2025-07-18 15:05", text: "Detector 4B reemplazado. Pendiente confirmar con el proveedor la garantía de la pieza." },
];

const INITIAL_FICHA_COMMENTS = [
  { id: "FC1", fichaId: "F2", author: "Ing. Marco Villarreal", date: "2025-07-19 08:10", text: "Confirmado con Siemens: el módulo detector está en garantía, no genera costo." },
];

const MANUFACTURERS = ["Todos", "Siemens Healthineers", "GE HealthCare", "Philips"];
const MAINT_TYPES = ["Todos", "Preventivo", "Correctivo", "Calibración"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Equipos", icon: Cpu },
  { id: "manuals", label: "Manuales", icon: BookOpen },
  { id: "maintenance", label: "Mantenimiento", icon: Wrench },
];

/* ---------------------------------------------------------------- */

export default function TecMedDataPrototype() {
  const [tab, setTab] = useState("dashboard");
  const [screen, setScreen] = useState("list");
  const [selectedEqId, setSelectedEqId] = useState(null);
  const [selectedFichaId, setSelectedFichaId] = useState(null);

  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);
  const [manuals, setManuals] = useState(INITIAL_MANUALS);
  const [maintenance, setMaintenance] = useState(INITIAL_MAINT);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [fichaComments, setFichaComments] = useState(INITIAL_FICHA_COMMENTS);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [manualManufacturer, setManualManufacturer] = useState("Todos");
  const [manualType, setManualType] = useState("Todos");
  const [manualSearch, setManualSearch] = useState("");
  const [maintTypeFilter, setMaintTypeFilter] = useState("Todos");
  const [maintSearch, setMaintSearch] = useState("");

  const [newComment, setNewComment] = useState("");
  const [newFichaComment, setNewFichaComment] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStatus, setReportStatus] = useState("available");
  const [reportLocation, setReportLocation] = useState("");
  const [reportNote, setReportNote] = useState("");

  const [showScanModal, setShowScanModal] = useState(false);
  const [scanMode, setScanMode] = useState("ocr"); // ocr | manual
  const [scanStage, setScanStage] = useState("idle"); // idle | scanning | reviewing
  const [scanForm, setScanForm] = useState(null);

  const [showManualModal, setShowManualModal] = useState(false);
  const [manualModalMode, setManualModalMode] = useState("scan"); // scan | upload
  const [manualStage, setManualStage] = useState("idle"); // scanning | reviewing
  const [manualForm, setManualForm] = useState(null);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrStage, setQrStage] = useState("scanning"); // scanning | found

  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function goTo(nextTab) {
    setTab(nextTab);
    setScreen("list");
  }

  function openEquipment(id) {
    setSelectedEqId(id);
    setTab("dashboard");
    setScreen("detail");
  }

  const selectedEq = equipment.find((e) => e.id === selectedEqId) || null;
  const selectedFicha = maintenance.find((f) => f.id === selectedFichaId) || null;

  const filteredEquipment = equipment.filter((e) => {
    const matchesSearch =
      search.trim() === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.model.toLowerCase().includes(search.toLowerCase()) ||
      e.serial.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    available: equipment.filter((e) => e.status === "available").length,
    maintenance: equipment.filter((e) => e.status === "maintenance").length,
    "in-use": equipment.filter((e) => e.status === "in-use").length,
  };

  const filteredManuals = manuals.filter((m) => {
    const matchesMan = manualManufacturer === "Todos" || m.manufacturer === manualManufacturer;
    const matchesType = manualType === "Todos" || m.type === manualType;
    const matchesSearch = manualSearch.trim() === "" || m.title.toLowerCase().includes(manualSearch.toLowerCase());
    return matchesMan && matchesType && matchesSearch;
  });

  const filteredMaint = maintenance
    .filter((f) => {
      const matchesType = maintTypeFilter === "Todos" || f.type === maintTypeFilter;
      const eq = equipment.find((e) => e.id === f.equipmentId);
      const matchesSearch =
        maintSearch.trim() === "" ||
        (eq && (eq.name.toLowerCase().includes(maintSearch.toLowerCase()) || eq.model.toLowerCase().includes(maintSearch.toLowerCase())));
      return matchesType && matchesSearch;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  function submitReport() {
    if (!reportLocation.trim()) {
      showToast("La ubicación es obligatoria para registrar el reporte");
      return;
    }
    setEquipment((prev) =>
      prev.map((e) => (e.id === selectedEq.id ? { ...e, status: reportStatus, location: reportLocation } : e))
    );
    setComments((prev) => [
      { id: "C" + Date.now(), equipmentId: selectedEq.id, author: "Tú", date: "Ahora mismo", text: `Estado actualizado a "${STATUS[reportStatus].label}" en ${reportLocation}.${reportNote ? " Nota: " + reportNote : ""}` },
      ...prev,
    ]);
    setShowReportModal(false);
    setReportNote("");
    showToast("Estado actualizado y ubicación registrada");
  }

  /* --- ficha de mantenimiento: por escaneo OCR o captura manual --- */
  function openMaintenanceForm(mode) {
    setScanMode(mode);
    setShowScanModal(true);
    if (mode === "ocr") {
      setScanStage("scanning");
      setTimeout(() => {
        setScanForm({
          equipmentId: selectedEq ? selectedEq.id : equipment[0].id,
          date: new Date().toISOString().slice(0, 10),
          type: "Preventivo",
          technician: "Ing. Laura Salinas",
          location: selectedEq ? selectedEq.location : equipment[0].location,
          activities: "Revisión general y limpieza de componentes internos.",
          result: "Aprobado",
        });
        setScanStage("reviewing");
      }, 1600);
    } else {
      setScanForm({
        equipmentId: selectedEq ? selectedEq.id : equipment[0].id,
        date: new Date().toISOString().slice(0, 10),
        type: "Preventivo",
        technician: "",
        location: selectedEq ? selectedEq.location : "",
        activities: "",
        result: "Aprobado",
      });
      setScanStage("reviewing");
    }
  }

  function confirmScan() {
    const newFicha = {
      id: "F" + Date.now(),
      equipmentId: scanForm.equipmentId,
      date: scanForm.date,
      type: scanForm.type,
      technician: scanForm.technician,
      location: scanForm.location,
      reason: "",
      activities: scanForm.activities,
      parts: "Ninguna",
      result: scanForm.result,
      nextDate: "",
      source: scanMode === "ocr" ? "Escaneado (OCR)" : "Captura manual",
      folio: "MT-" + Math.floor(1000 + Math.random() * 8999),
    };
    setMaintenance((prev) => [newFicha, ...prev]);
    setShowScanModal(false);
    setScanStage("idle");
    setScanForm(null);
    showToast(scanMode === "ocr" ? "Documento leído y mantenimiento guardado" : "Ficha de mantenimiento creada");
  }

  /* --- manuales: escanear físico o subir archivo --- */
  function openManualForm(mode) {
    setManualModalMode(mode);
    setShowManualModal(true);
    if (mode === "scan") {
      setManualStage("scanning");
      setTimeout(() => {
        setManualForm({
          equipmentId: equipment[0].id,
          title: "Manual detectado — " + equipment[0].model,
          manufacturer: equipment[0].manufacturer,
          type: "Operación",
        });
        setManualStage("reviewing");
      }, 1500);
    } else {
      setManualForm({ equipmentId: equipment[0].id, title: "", manufacturer: equipment[0].manufacturer, type: "Operación" });
      setManualStage("reviewing");
    }
  }

  function confirmManual() {
    const newManual = {
      id: "M" + Date.now(),
      equipmentId: manualForm.equipmentId,
      title: manualForm.title.trim() || "Manual sin título",
      manufacturer: manualForm.manufacturer,
      type: manualForm.type,
      pages: "—",
      size: manualModalMode === "scan" ? "Escaneado" : "Archivo subido",
    };
    setManuals((prev) => [newManual, ...prev]);
    setShowManualModal(false);
    setManualStage("idle");
    setManualForm(null);
    showToast(manualModalMode === "scan" ? "Manual escaneado y agregado a la biblioteca" : "Manual subido correctamente");
  }

  /* --- escanear QR de un equipo --- */
  function openQrScan() {
    setShowQrModal(true);
    setQrStage("scanning");
    setTimeout(() => {
      setQrStage("found");
      setTimeout(() => {
        setShowQrModal(false);
        setQrStage("scanning");
        openEquipment(equipment[0].id);
        showToast("Equipo identificado por código QR");
      }, 700);
    }, 1300);
  }

  function submitComment() {
    if (!newComment.trim()) return;
    setComments((prev) => [
      { id: "C" + Date.now(), equipmentId: selectedEq.id, author: "Tú", date: "Ahora mismo", text: newComment },
      ...prev,
    ]);
    setNewComment("");
  }

  function submitFichaComment() {
    if (!newFichaComment.trim()) return;
    setFichaComments((prev) => [
      { id: "FC" + Date.now(), fichaId: selectedFicha.id, author: "Tú", date: "Ahora mismo", text: newFichaComment },
      ...prev,
    ]);
    setNewFichaComment("");
  }

  /* -------------------------- render -------------------------- */

  return (
    <div className="tmd-app">
      <style>{CSS}</style>

      {/* ---- sidebar (desktop) ---- */}
      <aside className="tmd-sidebar">
        <div className="tmd-brand">
          <div className="tmd-brand-mark">TD</div>
          <div>
            <div className="tmd-brand-name">TecMed Data</div>
            <div className="tmd-brand-sub">Control de equipo médico</div>
          </div>
        </div>

        <button className="tmd-qr-cta" onClick={openQrScan}>
          <QrCode size={18} /> Escanear QR de equipo
        </button>

        <nav className="tmd-sidenav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} className={"tmd-sidenav-item" + (tab === item.id ? " tmd-navactive" : "")} onClick={() => goTo(item.id)}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ---- main content ---- */}
      <main className="tmd-main">
        <div className="tmd-content">
          {tab === "dashboard" && screen === "list" && (
            <DashboardScreen
              equipment={filteredEquipment}
              counts={counts}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onOpen={openEquipment}
              onScanQr={openQrScan}
            />
          )}

          {tab === "dashboard" && screen === "detail" && selectedEq && (
            <EquipmentDetailScreen
              eq={selectedEq}
              maintenance={maintenance.filter((f) => f.equipmentId === selectedEq.id)}
              comments={comments.filter((c) => c.equipmentId === selectedEq.id)}
              onBack={() => setScreen("list")}
              onViewManual={() => { setTab("manuals"); setManualSearch(selectedEq.model); }}
              onViewFicha={(id) => { setSelectedFichaId(id); setTab("maintenance"); setScreen("ficha"); }}
              onViewAllFichas={() => { setTab("maintenance"); setScreen("list"); setMaintSearch(selectedEq.model); }}
              onReport={() => { setReportStatus(selectedEq.status); setReportLocation(selectedEq.location); setShowReportModal(true); }}
              newComment={newComment}
              setNewComment={setNewComment}
              submitComment={submitComment}
            />
          )}

          {tab === "manuals" && (
            <ManualsScreen
              manuals={filteredManuals}
              equipment={equipment}
              manufacturer={manualManufacturer}
              setManufacturer={setManualManufacturer}
              type={manualType}
              setType={setManualType}
              search={manualSearch}
              setSearch={setManualSearch}
              onDownload={() => showToast("Descargando manual…")}
              onScan={() => openManualForm("scan")}
              onUpload={() => openManualForm("upload")}
            />
          )}

          {tab === "maintenance" && screen === "list" && (
            <MaintenanceListScreen
              records={filteredMaint}
              equipment={equipment}
              typeFilter={maintTypeFilter}
              setTypeFilter={setMaintTypeFilter}
              search={maintSearch}
              setSearch={setMaintSearch}
              onOpenFicha={(id) => { setSelectedFichaId(id); setScreen("ficha"); }}
              onScan={() => { setSelectedEqId(null); openMaintenanceForm("ocr"); }}
              onManual={() => { setSelectedEqId(null); openMaintenanceForm("manual"); }}
            />
          )}

          {tab === "maintenance" && screen === "ficha" && selectedFicha && (
            <FichaDetailScreen
              ficha={selectedFicha}
              eq={equipment.find((e) => e.id === selectedFicha.equipmentId)}
              comments={fichaComments.filter((c) => c.fichaId === selectedFicha.id)}
              newComment={newFichaComment}
              setNewComment={setNewFichaComment}
              submitComment={submitFichaComment}
              onBack={() => setScreen("list")}
            />
          )}
        </div>
      </main>

      {/* ---- bottom nav (mobile) ---- */}
      <nav className="tmd-bottomnav">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={"tmd-navitem" + (tab === item.id ? " tmd-navactive" : "")} onClick={() => goTo(item.id)}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
        <button className="tmd-navitem" onClick={openQrScan}>
          <QrCode size={20} />
          <span>Escanear QR</span>
        </button>
      </nav>

      {showReportModal && selectedEq && (
        <ReportModal
          eq={selectedEq}
          status={reportStatus}
          setStatus={setReportStatus}
          location={reportLocation}
          setLocation={setReportLocation}
          note={reportNote}
          setNote={setReportNote}
          onClose={() => setShowReportModal(false)}
          onSubmit={submitReport}
        />
      )}

      {showScanModal && (
        <MaintenanceFormModal
          mode={scanMode}
          stage={scanStage}
          form={scanForm}
          setForm={setScanForm}
          equipment={equipment}
          onClose={() => { setShowScanModal(false); setScanStage("idle"); setScanForm(null); }}
          onConfirm={confirmScan}
        />
      )}

      {showManualModal && (
        <ManualFormModal
          mode={manualModalMode}
          stage={manualStage}
          form={manualForm}
          setForm={setManualForm}
          equipment={equipment}
          onClose={() => { setShowManualModal(false); setManualStage("idle"); setManualForm(null); }}
          onConfirm={confirmManual}
        />
      )}

      {showQrModal && <QrScanModal stage={qrStage} onClose={() => setShowQrModal(false)} />}

      {toast && <div className="tmd-toast"><CheckCircle2 size={16} />{toast}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* SCREENS                                                           */
/* ---------------------------------------------------------------- */

function Header({ title, right }) {
  return (
    <div className="tmd-header">
      <div className="tmd-title">{title}</div>
      <div className="tmd-header-right">{right}</div>
    </div>
  );
}

function HeaderIcons() {
  return (
    <>
      <button className="tmd-icon-btn"><Bell size={18} /></button>
      <div className="tmd-avatar"><User size={16} /></div>
    </>
  );
}

function CommentsBlock({ items, value, setValue, onSubmit, placeholder, emptyText }) {
  return (
    <>
      <div className="tmd-comments">
        {items.length === 0 && <div className="tmd-muted tmd-empty-comments">{emptyText}</div>}
        {items.map((c) => (
          <div className="tmd-comment" key={c.id}>
            <div className="tmd-comment-avatar">{c.author.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
            <div>
              <div className="tmd-comment-meta"><strong>{c.author}</strong> · {c.date}</div>
              <div className="tmd-comment-text">{c.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="tmd-comment-input">
        <input placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSubmit()} />
        <button onClick={onSubmit}><Send size={15} /></button>
      </div>
    </>
  );
}

function DashboardScreen({ equipment, counts, search, setSearch, statusFilter, setStatusFilter, onOpen, onScanQr }) {
  return (
    <div className="tmd-screen">
      <Header title="Panel de Equipos" right={<HeaderIcons />} />

      <button className="tmd-qr-inline" onClick={onScanQr}>
        <QrCode size={20} />
        <div>
          <strong>Escanear código QR de un equipo</strong>
          <div className="tmd-upload-sub">Te lleva directo a su ficha, sin buscarlo</div>
        </div>
        <ChevronRight size={16} />
      </button>

      <div className="tmd-search">
        <Search size={16} />
        <input placeholder="Buscar por equipo, modelo o serie…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="tmd-summary">
        <div className="tmd-summary-card" style={{ background: STATUS.available.bg }}>
          <span style={{ color: STATUS.available.color }}>{counts.available}</span>
          <small>Disponibles</small>
        </div>
        <div className="tmd-summary-card" style={{ background: STATUS.maintenance.bg }}>
          <span style={{ color: STATUS.maintenance.color }}>{counts.maintenance}</span>
          <small>Mantenimiento</small>
        </div>
        <div className="tmd-summary-card" style={{ background: STATUS["in-use"].bg }}>
          <span style={{ color: STATUS["in-use"].color }}>{counts["in-use"]}</span>
          <small>En Uso</small>
        </div>
      </div>

      <div className="tmd-pillrow">
        {["all", "available", "maintenance", "in-use"].map((f) => (
          <button key={f} className={"tmd-pill" + (statusFilter === f ? " tmd-pill-active" : "")} onClick={() => setStatusFilter(f)}>
            {f === "all" ? "Todos" : STATUS[f].label}
          </button>
        ))}
      </div>

      <div className="tmd-equip-grid">
        {equipment.length === 0 && (
          <div className="tmd-empty"><AlertTriangle size={20} /><p>No se encontraron equipos con esos filtros.</p></div>
        )}
        {equipment.map((e) => (
          <button className="tmd-equip-card" key={e.id} onClick={() => onOpen(e.id)}>
            <div className="tmd-equip-icon"><Cpu size={18} /></div>
            <div className="tmd-equip-info">
              <div className="tmd-equip-name">{e.name}</div>
              <div className="tmd-equip-model">{e.model}</div>
              <div className="tmd-equip-meta"># {e.id} <MapPin size={11} /> {e.location}</div>
            </div>
            <div className="tmd-equip-right">
              <span className="tmd-badge" style={{ background: STATUS[e.status].bg, color: STATUS[e.status].color }}>
                <span className="tmd-dot" style={{ background: STATUS[e.status].dot }} /> {STATUS[e.status].label}
              </span>
              <ChevronRight size={16} color="#9CA3AF" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EquipmentDetailScreen({ eq, maintenance, comments, onBack, onViewManual, onViewFicha, onViewAllFichas, onReport, newComment, setNewComment, submitComment }) {
  return (
    <div className="tmd-screen">
      <button className="tmd-backbtn" onClick={onBack}><ArrowLeft size={16} /> Panel</button>

      <div className="tmd-detail-head">
        <div className="tmd-equip-icon tmd-equip-icon-lg"><Cpu size={22} /></div>
        <div>
          <div className="tmd-detail-title">{eq.name}</div>
          <div className="tmd-detail-model">{eq.model}</div>
          <div className="tmd-detail-badges">
            <span className="tmd-badge" style={{ background: STATUS[eq.status].bg, color: STATUS[eq.status].color }}>
              <span className="tmd-dot" style={{ background: STATUS[eq.status].dot }} /> {STATUS[eq.status].label}
            </span>
            <span className="tmd-badge-outline">{eq.online ? "● En línea" : "○ Sin conexión"}</span>
          </div>
        </div>
      </div>

      <div className="tmd-detail-grid">
        <div className="tmd-detail-main">
          <div className="tmd-info-grid">
            <div className="tmd-info-box"><small>ID DE EQUIPO</small><strong>{eq.id}</strong></div>
            <div className="tmd-info-box"><small>NO. DE SERIE</small><strong>{eq.serial}</strong></div>
            <div className="tmd-info-box"><small>FABRICANTE</small><strong>{eq.manufacturer}</strong></div>
            <div className="tmd-info-box"><small>AÑO</small><strong>{eq.year}</strong></div>
          </div>

          <div className="tmd-section-label">UBICACIÓN</div>
          <div className="tmd-location-card">
            <MapPin size={18} color="#0F766E" />
            <div>
              <strong>{eq.location}</strong>
              <div className="tmd-muted">{eq.department}</div>
            </div>
          </div>

          <div className="tmd-section-label">ESPECIFICACIONES TÉCNICAS</div>
          <div className="tmd-specs">
            {Object.entries(eq.specs).map(([k, v]) => (
              <div className="tmd-spec-row" key={k}><span>{k}</span><span className="tmd-spec-val">{v}</span></div>
            ))}
          </div>

          <div className="tmd-section-label">CALENDARIO DE MANTENIMIENTO</div>
          <div className="tmd-info-grid">
            <div className="tmd-info-box"><small>ÚLTIMO</small><strong>{eq.lastMaint}</strong></div>
            <div className="tmd-info-box"><small>PRÓXIMO</small><strong>{eq.nextMaint}</strong></div>
          </div>

          <div className="tmd-section-label">ACCIONES RÁPIDAS</div>
          <button className="tmd-action-row" onClick={onViewManual}>
            <div className="tmd-action-icon" style={{ background: "#ECFDF5" }}><FileText size={16} color="#059669" /></div>
            <div><strong>Manual Técnico</strong><div className="tmd-muted">Ver y descargar documentación</div></div>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
          <button className="tmd-action-row" onClick={onViewAllFichas}>
            <div className="tmd-action-icon" style={{ background: "#EFF6FF" }}><ClipboardList size={16} color="#2563EB" /></div>
            <div><strong>Historial de Mantenimiento</strong><div className="tmd-muted">{maintenance.length} registro{maintenance.length !== 1 ? "s" : ""}</div></div>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>
          <button className="tmd-action-row" onClick={onReport}>
            <div className="tmd-action-icon" style={{ background: "#FEF2F2" }}><AlertTriangle size={16} color="#DC2626" /></div>
            <div><strong>Actualizar Estado / Reportar</strong><div className="tmd-muted">Pide confirmar la ubicación</div></div>
            <ChevronRight size={16} color="#9CA3AF" />
          </button>

          {maintenance.length > 0 && (
            <>
              <div className="tmd-section-label">ÚLTIMOS SERVICIOS</div>
              {maintenance.slice(0, 2).map((f) => (
                <button className="tmd-maint-mini" key={f.id} onClick={() => onViewFicha(f.id)}>
                  <span className="tmd-type-badge">{f.type}</span>
                  <span>{f.date}</span>
                  <ChevronRight size={14} color="#9CA3AF" />
                </button>
              ))}
            </>
          )}
        </div>

        <div className="tmd-detail-side">
          <div className="tmd-section-label">COMENTARIOS DEL EQUIPO BIOMÉDICO</div>
          <CommentsBlock
            items={comments}
            value={newComment}
            setValue={setNewComment}
            onSubmit={submitComment}
            placeholder="Agregar una nota sobre este equipo…"
            emptyText="Aún no hay comentarios para este equipo."
          />
        </div>
      </div>
    </div>
  );
}

function ManualsScreen({ manuals, equipment, manufacturer, setManufacturer, type, setType, search, setSearch, onDownload, onScan, onUpload }) {
  return (
    <div className="tmd-screen">
      <Header title="Manuales" right={<HeaderIcons />} />

      <div className="tmd-two-cta">
        <button className="tmd-upload-cta" onClick={onScan}>
          <ScanLine size={18} />
          <div>
            <strong>Escanear manual en papel</strong>
            <div className="tmd-upload-sub">OCR digitaliza el manual físico</div>
          </div>
        </button>
        <button className="tmd-upload-cta tmd-upload-cta-secondary" onClick={onUpload}>
          <UploadCloud size={18} />
          <div>
            <strong>Subir manual (PDF)</strong>
            <div className="tmd-upload-sub">Ya lo tienes en digital</div>
          </div>
        </button>
      </div>

      <div className="tmd-search">
        <Search size={16} />
        <input placeholder="Buscar manual por equipo o modelo…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="tmd-filter-row">
        <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}>
          {MANUFACTURERS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {["Todos", "Operación", "Servicio"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="tmd-equip-grid">
        {manuals.length === 0 && (
          <div className="tmd-empty"><AlertTriangle size={20} /><p>No hay manuales que coincidan con esos filtros.</p></div>
        )}
        {manuals.map((m) => {
          const eq = equipment.find((e) => e.id === m.equipmentId);
          return (
            <div className="tmd-manual-card" key={m.id}>
              <div className="tmd-equip-icon" style={{ background: "#ECFDF5" }}><FileText size={18} color="#059669" /></div>
              <div className="tmd-equip-info">
                <div className="tmd-equip-name">{m.title}</div>
                <div className="tmd-equip-meta">{m.manufacturer} · {m.pages} pág. · {m.size}</div>
                {eq && <div className="tmd-muted">Equipo: {eq.name} — {eq.location}</div>}
              </div>
              <button className="tmd-download-btn" onClick={onDownload}><Download size={16} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MaintenanceListScreen({ records, equipment, typeFilter, setTypeFilter, search, setSearch, onOpenFicha, onScan, onManual }) {
  return (
    <div className="tmd-screen">
      <Header title="Mantenimiento" right={<HeaderIcons />} />

      <div className="tmd-two-cta">
        <button className="tmd-upload-cta" onClick={onScan}>
          <ScanLine size={18} />
          <div>
            <strong>Escanear documento en papel</strong>
            <div className="tmd-upload-sub">OCR + IA lo captura solo</div>
          </div>
        </button>
        <button className="tmd-upload-cta tmd-upload-cta-secondary" onClick={onManual}>
          <PenLine size={18} />
          <div>
            <strong>Crear ficha manualmente</strong>
            <div className="tmd-upload-sub">Captura digital directa</div>
          </div>
        </button>
      </div>

      <div className="tmd-search">
        <Search size={16} />
        <input placeholder="Buscar por equipo o modelo…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="tmd-pillrow">
        {MAINT_TYPES.map((t) => (
          <button key={t} className={"tmd-pill" + (typeFilter === t ? " tmd-pill-active" : "")} onClick={() => setTypeFilter(t)}>{t}</button>
        ))}
      </div>

      <div className="tmd-equip-grid">
        {records.length === 0 && <div className="tmd-empty"><AlertTriangle size={20} /><p>No hay registros con esos filtros.</p></div>}
        {records.map((f) => {
          const eq = equipment.find((e) => e.id === f.equipmentId);
          return (
            <button className="tmd-maint-card" key={f.id} onClick={() => onOpenFicha(f.id)}>
              <div className="tmd-maint-top">
                <span className="tmd-type-badge">{f.type}</span>
                <span className="tmd-muted">{f.date}</span>
              </div>
              <div className="tmd-equip-name">{eq ? `${eq.name} — ${eq.model}` : f.equipmentId}</div>
              <div className="tmd-equip-meta">{f.technician || "Sin técnico asignado"} · {f.source === "Escaneado (OCR)" ? "📄 Capturado por OCR" : "✍️ Captura manual"}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FichaDetailScreen({ ficha, eq, comments, newComment, setNewComment, submitComment, onBack }) {
  return (
    <div className="tmd-screen">
      <button className="tmd-backbtn" onClick={onBack}><ArrowLeft size={16} /> Mantenimiento</button>

      <div className="tmd-detail-title">Ficha de Mantenimiento</div>
      <div className="tmd-detail-model">Folio {ficha.folio}</div>

      <div className="tmd-detail-grid">
        <div className="tmd-detail-main">
          <div className="tmd-ficha-block">
            <div className="tmd-ficha-row"><span>Equipo</span><strong>{eq ? `${eq.name} — ${eq.model}` : ficha.equipmentId}</strong></div>
            <div className="tmd-ficha-row"><span>Tipo de mantenimiento</span><span className="tmd-type-badge">{ficha.type}</span></div>
            <div className="tmd-ficha-row"><span>Fecha de servicio</span><strong>{ficha.date}</strong></div>
            <div className="tmd-ficha-row"><span>Técnico responsable</span><strong>{ficha.technician || "—"}</strong></div>
            <div className="tmd-ficha-row"><span>Ubicación del servicio</span><strong>{ficha.location}</strong></div>
            {ficha.reason && <div className="tmd-ficha-row"><span>Motivo / falla reportada</span><strong>{ficha.reason}</strong></div>}
            <div className="tmd-ficha-row-block"><span>Actividades realizadas</span><p>{ficha.activities || "—"}</p></div>
            <div className="tmd-ficha-row"><span>Refacciones / insumos</span><strong>{ficha.parts}</strong></div>
            <div className="tmd-ficha-row"><span>Resultado</span><strong style={{ color: ficha.result === "Aprobado" ? "#16A34A" : ficha.result === "Requiere seguimiento" ? "#D97706" : "#DC2626" }}>{ficha.result}</strong></div>
            {ficha.nextDate && <div className="tmd-ficha-row"><span>Próximo servicio programado</span><strong>{ficha.nextDate}</strong></div>}
            <div className="tmd-ficha-row"><span>Origen del documento</span><strong>{ficha.source}</strong></div>
          </div>
        </div>

        <div className="tmd-detail-side">
          <div className="tmd-section-label">COMENTARIOS DE ESTA FICHA</div>
          <CommentsBlock
            items={comments}
            value={newComment}
            setValue={setNewComment}
            onSubmit={submitComment}
            placeholder="Agregar una nota sobre este mantenimiento…"
            emptyText="Aún no hay comentarios en esta ficha."
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* MODALS                                                            */
/* ---------------------------------------------------------------- */

function ReportModal({ eq, status, setStatus, location, setLocation, note, setNote, onClose, onSubmit }) {
  return (
    <div className="tmd-modal-overlay" onClick={onClose}>
      <div className="tmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tmd-modal-header">
          <strong>Actualizar Estado</strong>
          <button className="tmd-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="tmd-modal-sub">{eq.name} — {eq.model}</div>

        <label className="tmd-form-label">Nuevo estado</label>
        <select className="tmd-form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.keys(STATUS).map((k) => <option key={k} value={k}>{STATUS[k].label}</option>)}
        </select>

        <label className="tmd-form-label">Ubicación actual <span className="tmd-required">(obligatorio)</span></label>
        <div className="tmd-input-with-icon">
          <MapPin size={15} />
          <input className="tmd-form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej. Ala de Radiología A" />
        </div>

        <label className="tmd-form-label">Nota (opcional)</label>
        <textarea className="tmd-form-input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Detalles del reporte…" />

        <button className="tmd-btn-primary" onClick={onSubmit}><Check size={16} /> Guardar Reporte</button>
      </div>
    </div>
  );
}

function MaintenanceFormModal({ mode, stage, form, setForm, equipment, onClose, onConfirm }) {
  return (
    <div className="tmd-modal-overlay" onClick={onClose}>
      <div className="tmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tmd-modal-header">
          <strong>{mode === "ocr" ? "Escanear Documento de Mantenimiento" : "Nueva Ficha de Mantenimiento"}</strong>
          <button className="tmd-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {stage === "scanning" && (
          <div className="tmd-scan-loading">
            <div className="tmd-scan-icon"><ScanLine size={28} /></div>
            <Loader2 size={20} className="tmd-spin" />
            <p>Leyendo el documento con OCR…</p>
            <small className="tmd-muted">Detectando fecha, técnico, tipo de servicio y hallazgos</small>
          </div>
        )}

        {stage === "reviewing" && form && (
          <>
            {mode === "ocr" ? (
              <div className="tmd-ocr-note"><CheckCircle2 size={14} color="#16A34A" /> Datos detectados automáticamente — revisa y edita antes de guardar</div>
            ) : (
              <div className="tmd-ocr-note tmd-manual-note"><PenLine size={14} color="#2563EB" /> Captura digital directa — llena los campos del servicio</div>
            )}

            <label className="tmd-form-label">Equipo</label>
            <select className="tmd-form-input" value={form.equipmentId} onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}>
              {equipment.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.model}</option>)}
            </select>

            <label className="tmd-form-label">Tipo de mantenimiento</label>
            <select className="tmd-form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {["Preventivo", "Correctivo", "Calibración"].map((t) => <option key={t}>{t}</option>)}
            </select>

            <label className="tmd-form-label">Fecha</label>
            <input type="date" className="tmd-form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />

            <label className="tmd-form-label">Técnico responsable</label>
            <input className="tmd-form-input" value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })} placeholder="Nombre del técnico" />

            <label className="tmd-form-label">Ubicación</label>
            <input className="tmd-form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ej. Ala de Radiología A" />

            <label className="tmd-form-label">Actividades realizadas</label>
            <textarea className="tmd-form-input" rows={3} value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} placeholder="Describe el servicio realizado…" />

            <label className="tmd-form-label">Resultado</label>
            <select className="tmd-form-input" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
              {["Aprobado", "Requiere seguimiento", "Equipo dado de baja"].map((r) => <option key={r}>{r}</option>)}
            </select>

            <button className="tmd-btn-primary" onClick={onConfirm}><Check size={16} /> Guardar en la Base de Datos</button>
          </>
        )}
      </div>
    </div>
  );
}

function ManualFormModal({ mode, stage, form, setForm, equipment, onClose, onConfirm }) {
  return (
    <div className="tmd-modal-overlay" onClick={onClose}>
      <div className="tmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tmd-modal-header">
          <strong>{mode === "scan" ? "Escanear Manual en Papel" : "Subir Manual (PDF)"}</strong>
          <button className="tmd-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {stage === "scanning" && (
          <div className="tmd-scan-loading">
            <div className="tmd-scan-icon"><ScanLine size={28} /></div>
            <Loader2 size={20} className="tmd-spin" />
            <p>Digitalizando el documento…</p>
            <small className="tmd-muted">Detectando título, fabricante y equipo</small>
          </div>
        )}

        {stage === "reviewing" && form && (
          <>
            {mode === "scan" ? (
              <div className="tmd-ocr-note"><CheckCircle2 size={14} color="#16A34A" /> Detectado automáticamente — revisa antes de guardar</div>
            ) : (
              <div className="tmd-dropzone"><UploadCloud size={20} /><span>archivo-manual.pdf seleccionado</span></div>
            )}

            <label className="tmd-form-label">Equipo relacionado</label>
            <select className="tmd-form-input" value={form.equipmentId} onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}>
              {equipment.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.model}</option>)}
            </select>

            <label className="tmd-form-label">Título del manual</label>
            <input className="tmd-form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej. Manual de Operación — SOMATOM Drive" />

            <label className="tmd-form-label">Fabricante</label>
            <input className="tmd-form-input" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />

            <label className="tmd-form-label">Tipo de manual</label>
            <select className="tmd-form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {["Operación", "Servicio"].map((t) => <option key={t}>{t}</option>)}
            </select>

            <button className="tmd-btn-primary" onClick={onConfirm}><Check size={16} /> Guardar en Biblioteca de Manuales</button>
          </>
        )}
      </div>
    </div>
  );
}

function QrScanModal({ stage, onClose }) {
  return (
    <div className="tmd-modal-overlay" onClick={onClose}>
      <div className="tmd-modal tmd-qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tmd-modal-header">
          <strong>Escanear Código QR</strong>
          <button className="tmd-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="tmd-camera-view">
          <div className="tmd-camera-frame">
            <span className="tmd-corner tmd-corner-tl" />
            <span className="tmd-corner tmd-corner-tr" />
            <span className="tmd-corner tmd-corner-bl" />
            <span className="tmd-corner tmd-corner-br" />
            {stage === "scanning" && <div className="tmd-scanline" />}
            {stage === "found" && (
              <div className="tmd-qr-found"><CheckCircle2 size={30} color="#22C55E" /></div>
            )}
          </div>
          <p className="tmd-camera-hint">
            {stage === "scanning" ? "Apunta la cámara al código QR pegado en el equipo…" : "Código reconocido — abriendo ficha del equipo…"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* CSS                                                                */
/* ---------------------------------------------------------------- */

const CSS = `
  * { box-sizing: border-box; }
  .tmd-app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
    display: flex;
    min-height: 100vh;
    background: #F7F8FA;
    color: #111827;
  }

  /* ---- sidebar (desktop nav) ---- */
  .tmd-sidebar { width: 232px; flex-shrink: 0; background: #FFFFFF; border-right: 1px solid #E5E7EB; padding: 22px 16px; display: flex; flex-direction: column; gap: 18px; position: sticky; top: 0; height: 100vh; }
  .tmd-brand { display: flex; align-items: center; gap: 10px; padding: 0 4px; }
  .tmd-brand-mark { width: 34px; height: 34px; border-radius: 9px; background: #0F766E; color: white; font-weight: 700; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tmd-brand-name { font-weight: 700; font-size: 14px; color: #111827; }
  .tmd-brand-sub { font-size: 10.5px; color: #9CA3AF; }
  .tmd-qr-cta { display: flex; align-items: center; gap: 8px; background: #0F766E; color: white; border: none; border-radius: 12px; padding: 11px 12px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .tmd-sidenav { display: flex; flex-direction: column; gap: 2px; margin-top: 4px; }
  .tmd-sidenav-item { display: flex; align-items: center; gap: 10px; border: none; background: transparent; padding: 10px 10px; border-radius: 10px; font-size: 13.5px; font-weight: 500; color: #4B5563; cursor: pointer; text-align: left; }
  .tmd-sidenav-item.tmd-navactive { background: #ECFDF5; color: #0F766E; font-weight: 700; }

  @media (max-width: 880px) { .tmd-sidebar { display: none; } }

  /* ---- main ---- */
  .tmd-main { flex: 1; min-width: 0; }
  .tmd-content { max-width: 1180px; margin: 0 auto; padding: 28px 32px 100px; }
  @media (max-width: 880px) { .tmd-content { padding: 16px 16px 90px; } }

  .tmd-screen { display: block; }
  .tmd-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .tmd-title { font-size: 24px; font-weight: 700; color: #0B0B0F; }
  .tmd-header-right { display: flex; align-items: center; gap: 8px; }
  .tmd-icon-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: #FFFFFF; box-shadow: 0 1px 2px rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #374151; }
  .tmd-avatar { width: 34px; height: 34px; border-radius: 50%; background: #0F766E; color: white; display: flex; align-items: center; justify-content: center; }

  .tmd-qr-inline { display: flex; align-items: center; gap: 12px; width: 100%; background: #ECFDF5; border: 1px dashed #0F766E55; color: #0F766E; border-radius: 14px; padding: 13px 16px; margin-bottom: 16px; cursor: pointer; text-align: left; }
  .tmd-qr-inline strong { font-size: 13.5px; display: block; color: #0F766E; }
  .tmd-qr-inline .tmd-upload-sub { color: #0F766E99; }
  .tmd-qr-inline > div { flex: 1; }
  @media (min-width: 881px) { .tmd-qr-inline { display: none; } }

  .tmd-search { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 10px 14px; margin-bottom: 14px; color: #9CA3AF; max-width: 480px; }
  .tmd-search input { border: none; outline: none; flex: 1; font-size: 14px; color: #111827; background: transparent; }

  .tmd-summary { display: flex; gap: 10px; margin-bottom: 14px; max-width: 480px; }
  .tmd-summary-card { flex: 1; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; }
  .tmd-summary-card span { font-size: 22px; font-weight: 700; }
  .tmd-summary-card small { font-size: 11px; color: #4B5563; margin-top: 2px; }

  .tmd-pillrow { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 16px; padding-bottom: 2px; }
  .tmd-pill { flex-shrink: 0; border: 1px solid #E5E7EB; background: #FFFFFF; border-radius: 999px; padding: 6px 14px; font-size: 13px; color: #374151; cursor: pointer; }
  .tmd-pill-active { background: #0F766E; color: white; border-color: #0F766E; }

  .tmd-equip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .tmd-equip-card, .tmd-manual-card { display: flex; align-items: center; gap: 12px; background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 14px; padding: 12px; text-align: left; cursor: pointer; }
  .tmd-equip-icon { width: 40px; height: 40px; border-radius: 10px; background: #EEF2FF; color: #4338CA; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tmd-equip-icon-lg { width: 48px; height: 48px; border-radius: 12px; }
  .tmd-equip-info { flex: 1; min-width: 0; }
  .tmd-equip-name { font-weight: 600; font-size: 14px; color: #111827; }
  .tmd-equip-model { font-size: 12px; color: #6B7280; margin: 1px 0 4px; }
  .tmd-equip-meta { font-size: 11px; color: #9CA3AF; display: flex; align-items: center; gap: 4px; }
  .tmd-equip-right { display: flex; align-items: center; gap: 6px; }
  .tmd-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 4px 9px; border-radius: 999px; white-space: nowrap; }
  .tmd-badge-outline { font-size: 11px; padding: 4px 9px; border-radius: 999px; border: 1px solid #E5E7EB; color: #6B7280; }
  .tmd-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .tmd-download-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #E5E7EB; background: #F9FAFB; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #374151; flex-shrink: 0; }

  .tmd-empty { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 40px 12px; color: #9CA3AF; text-align: center; }

  .tmd-backbtn { display: flex; align-items: center; gap: 6px; border: none; background: transparent; color: #0F766E; font-weight: 600; font-size: 14px; padding: 4px 0 14px; cursor: pointer; }
  .tmd-detail-head { display: flex; gap: 12px; align-items: center; margin-bottom: 18px; }
  .tmd-detail-title { font-size: 19px; font-weight: 700; color: #111827; }
  .tmd-detail-model { font-size: 13px; color: #6B7280; margin: 2px 0 6px; }
  .tmd-detail-badges { display: flex; gap: 8px; }

  .tmd-detail-grid { display: block; }
  .tmd-detail-side { margin-top: 24px; }
  @media (min-width: 900px) {
    .tmd-detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; align-items: start; }
    .tmd-detail-side { margin-top: 0; position: sticky; top: 24px; }
  }

  .tmd-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .tmd-info-box { background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 12px; padding: 10px 12px; }
  .tmd-info-box small { display: block; font-size: 10px; color: #9CA3AF; letter-spacing: 0.04em; margin-bottom: 3px; }
  .tmd-info-box strong { font-size: 13px; color: #111827; font-family: ui-monospace, "SF Mono", monospace; }

  .tmd-section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: #9CA3AF; margin: 18px 0 8px; }
  .tmd-location-card { display: flex; gap: 10px; align-items: center; background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 14px; padding: 14px; }
  .tmd-muted { color: #6B7280; font-size: 12px; }

  .tmd-specs { background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 14px; overflow: hidden; }
  .tmd-spec-row { display: flex; justify-content: space-between; padding: 11px 14px; font-size: 13px; color: #4B5563; border-bottom: 1px solid #F3F4F6; }
  .tmd-spec-row:last-child { border-bottom: none; }
  .tmd-spec-val { color: #111827; font-weight: 600; }

  .tmd-action-row { display: flex; align-items: center; gap: 12px; width: 100%; background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 14px; padding: 12px 14px; margin-bottom: 8px; cursor: pointer; text-align: left; }
  .tmd-action-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tmd-action-row strong { font-size: 13px; color: #111827; }
  .tmd-action-row > div:nth-child(2) { flex: 1; }

  .tmd-maint-mini { display: flex; align-items: center; gap: 10px; width: 100%; background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 12px; padding: 10px 12px; margin-bottom: 6px; cursor: pointer; font-size: 13px; color: #374151; }
  .tmd-maint-mini > span:nth-child(2) { flex: 1; text-align: left; }

  .tmd-type-badge { background: #EEF2FF; color: #4338CA; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; white-space: nowrap; }

  .tmd-comments { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
  .tmd-empty-comments { padding: 10px 0; }
  .tmd-comment { display: flex; gap: 10px; background: #FFFDF5; border: 1px solid #FDE68A44; border-radius: 12px; padding: 10px 12px; }
  .tmd-comment-avatar { width: 28px; height: 28px; border-radius: 50%; background: #0F766E; color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tmd-comment-meta { font-size: 11px; color: #9CA3AF; margin-bottom: 2px; }
  .tmd-comment-text { font-size: 13px; color: #374151; }
  .tmd-comment-input { display: flex; gap: 8px; margin-top: 4px; }
  .tmd-comment-input input { flex: 1; border: 1px solid #E5E7EB; border-radius: 10px; padding: 10px 12px; font-size: 13px; outline: none; }
  .tmd-comment-input button { width: 40px; border-radius: 10px; border: none; background: #0F766E; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }

  .tmd-filter-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .tmd-filter-row select { border: 1px solid #E5E7EB; border-radius: 10px; padding: 8px 10px; font-size: 12px; color: #374151; background: #FFFFFF; }

  .tmd-two-cta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  @media (max-width: 560px) { .tmd-two-cta { grid-template-columns: 1fr; } }
  .tmd-upload-cta { display: flex; align-items: center; gap: 12px; background: #0F766E; color: white; border: none; border-radius: 16px; padding: 14px 16px; cursor: pointer; text-align: left; }
  .tmd-upload-cta-secondary { background: #FFFFFF; color: #111827; border: 1px solid #E5E7EB; }
  .tmd-upload-cta-secondary .tmd-upload-sub { color: #6B7280; }
  .tmd-upload-cta strong { font-size: 13.5px; display: block; }
  .tmd-upload-sub { font-size: 11px; opacity: 0.85; margin-top: 2px; }

  .tmd-maint-card { display: flex; flex-direction: column; gap: 4px; background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 14px; padding: 12px 14px; cursor: pointer; text-align: left; }
  .tmd-maint-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; font-size: 12px; }

  .tmd-ficha-block { background: #FFFFFF; border: 1px solid #EFF1F4; border-radius: 14px; padding: 4px 14px; margin-top: 14px; }
  .tmd-ficha-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #6B7280; }
  .tmd-ficha-row strong { color: #111827; text-align: right; }
  .tmd-ficha-row-block { padding: 12px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #6B7280; }
  .tmd-ficha-row-block p { color: #111827; margin: 6px 0 0; line-height: 1.5; }
  .tmd-ficha-row:last-child, .tmd-ficha-row-block:last-child { border-bottom: none; }

  .tmd-bottomnav { display: none; position: fixed; bottom: 0; left: 0; right: 0; border-top: 1px solid #E5E7EB; background: #FFFFFF; z-index: 40; }
  @media (max-width: 880px) { .tmd-bottomnav { display: flex; } }
  .tmd-navitem { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 9px 0 12px; border: none; background: transparent; color: #9CA3AF; font-size: 9.5px; cursor: pointer; }
  .tmd-navactive { color: #0F766E; }

  .tmd-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
  .tmd-modal { background: white; border-radius: 20px; padding: 20px; width: 100%; max-width: 380px; max-height: 85vh; overflow-y: auto; }
  .tmd-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
  .tmd-modal-sub { font-size: 12px; color: #6B7280; margin-bottom: 14px; }
  .tmd-form-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin: 12px 0 5px; }
  .tmd-required { color: #DC2626; font-weight: 500; }
  .tmd-form-input { width: 100%; border: 1px solid #E5E7EB; border-radius: 10px; padding: 10px 12px; font-size: 13px; box-sizing: border-box; outline: none; font-family: inherit; }
  .tmd-input-with-icon { position: relative; display: flex; align-items: center; }
  .tmd-input-with-icon svg { position: absolute; left: 12px; color: #9CA3AF; }
  .tmd-input-with-icon .tmd-form-input { padding-left: 34px; }
  .tmd-btn-primary { width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px; background: #0F766E; color: white; border: none; border-radius: 12px; padding: 12px; font-size: 14px; font-weight: 600; margin-top: 18px; cursor: pointer; }

  .tmd-scan-loading { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 30px 10px 10px; text-align: center; }
  .tmd-scan-icon { width: 56px; height: 56px; border-radius: 50%; background: #ECFDF5; color: #0F766E; display: flex; align-items: center; justify-content: center; }
  .tmd-spin { animation: tmd-spin 1s linear infinite; color: #0F766E; }
  @keyframes tmd-spin { to { transform: rotate(360deg); } }
  .tmd-ocr-note { display: flex; align-items: center; gap: 6px; background: #ECFDF5; color: #047857; font-size: 12px; padding: 8px 10px; border-radius: 10px; margin: 10px 0 4px; }
  .tmd-manual-note { background: #EFF6FF; color: #1D4ED8; }
  .tmd-dropzone { display: flex; align-items: center; gap: 8px; background: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 10px; padding: 12px; font-size: 12.5px; color: #4B5563; margin: 10px 0 4px; }

  .tmd-qr-modal { max-width: 340px; }
  .tmd-camera-view { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 12px 4px 4px; }
  .tmd-camera-frame { position: relative; width: 240px; height: 240px; background: #0B0B0F; border-radius: 18px; overflow: hidden; }
  .tmd-corner { position: absolute; width: 26px; height: 26px; border: 3px solid #22C55E; }
  .tmd-corner-tl { top: 12px; left: 12px; border-right: none; border-bottom: none; border-radius: 6px 0 0 0; }
  .tmd-corner-tr { top: 12px; right: 12px; border-left: none; border-bottom: none; border-radius: 0 6px 0 0; }
  .tmd-corner-bl { bottom: 12px; left: 12px; border-right: none; border-top: none; border-radius: 0 0 0 6px; }
  .tmd-corner-br { bottom: 12px; right: 12px; border-left: none; border-top: none; border-radius: 0 0 6px 0; }
  .tmd-scanline { position: absolute; left: 12px; right: 12px; height: 2px; background: #22C55E; box-shadow: 0 0 8px 2px #22C55E88; animation: tmd-scan 1.6s ease-in-out infinite; }
  @keyframes tmd-scan { 0% { top: 16px; } 50% { top: 220px; } 100% { top: 16px; } }
  .tmd-qr-found { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.35); }
  .tmd-camera-hint { font-size: 12.5px; color: #6B7280; text-align: center; margin: 0; }

  .tmd-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #111827; color: white; padding: 10px 18px; border-radius: 999px; font-size: 13px; display: flex; align-items: center; gap: 8px; z-index: 60; box-shadow: 0 10px 25px rgba(0,0,0,0.25); }
  @media (max-width: 880px) { .tmd-toast { bottom: 84px; } }
`;
