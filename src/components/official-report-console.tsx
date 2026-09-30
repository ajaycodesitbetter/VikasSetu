import type { Map as LeafletMap, LayerGroup } from "leaflet";

import {
  CheckCircle2,
  CircleDot,
  Construction,
  Droplets,
  HeartPulse,
  MapPin,
  MessageSquare,
  Navigation,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  readReports,
  saveReport,
  type Category,
  type District,
  type Issue,
} from "@/lib/report-store";

type Props = { district: District; districtName: string; officialName: string };
const centers: Record<District, { lat: number; lng: number; zoom: number }> = {
  gwalior: { lat: 26.2183, lng: 78.1828, zoom: 12 },
  bhind: { lat: 26.5587, lng: 78.7873, zoom: 12 },
  morena: { lat: 26.4947, lng: 77.994, zoom: 12 },
};
const labels: Record<Category, string> = {
  roads: "Roads",
  water: "Water",
  sanitation: "Sanitation",
  health: "Health",
  electricity: "Electricity",
  other: "Other",
};
const icons = {
  roads: Construction,
  water: Droplets,
  sanitation: Trash2,
  health: HeartPulse,
  electricity: Zap,
  other: CircleDot,
} as const;
const statuses = ["Reported", "Under review", "Work scheduled", "Resolved"];

export function OfficialReportConsole({ district, districtName, officialName }: Props) {
  const [reports, setReports] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [selectedId, setSelectedId] = useState<string>();
  const [status, setStatus] = useState("Under review");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  const load = () =>
    readReports()
      .then(setReports)
      .catch(() => setReports([]));
  useEffect(() => {
    void load();
    window.addEventListener("vikassetu:reports-changed", load);
    return () => window.removeEventListener("vikassetu:reports-changed", load);
  }, []);
  const districtReports = useMemo(
    () => reports.filter((item) => item.district === district),
    [reports, district],
  );
  const visible = useMemo(
    () => districtReports.filter((item) => filter === "all" || item.category === filter),
    [districtReports, filter],
  );
  const selected = districtReports.find((item) => item.id === selectedId);

  useEffect(() => {
    let cancelled = false;
    setMapReady(false);

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapNode.current) return;
      try {
        const L = (await import("leaflet")).default;
        if (cancelled || !mapNode.current) return;

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const center = centers[district];
        const map = L.map(mapNode.current, {
          center: [center.lat, center.lng],
          zoom: center.zoom,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const layer = L.layerGroup().addTo(map);
        markersLayerRef.current = layer;
        mapRef.current = map;
        setMapError(false);
        setMapReady(true);
      } catch {
        if (!cancelled) setMapError(true);
      }
    }

    void initLeaflet();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [district]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!mapReady || !map || !layer) return;

    let cancelled = false;
    async function renderMarkers() {
      const L = (await import("leaflet")).default;
      if (cancelled || !markersLayerRef.current) return;
      markersLayerRef.current.clearLayers();

      visible.forEach((issue) => {
        const icon = L.divIcon({
          className: "custom-official-marker",
          html: `<div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 9999px;
            background: #0284c7;
            color: #ffffff;
            font-weight: 700;
            font-size: 12px;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
          ">1</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([issue.lat, issue.lng], {
          icon,
          title: `${issue.title} — ${issue.status}`,
        });
        marker.on("click", () => setSelectedId(issue.id));
        marker.addTo(markersLayerRef.current!);
      });
    }

    void renderMarkers();
    return () => {
      cancelled = true;
    };
  }, [visible, mapReady]);

  useEffect(() => {
    if (!selected) return;
    setStatus(selected.status);
  }, [selected]);

  const selectReport = (issue: Issue) => {
    setSelectedId(issue.id);
    setStatus(issue.status);
    setFeedback("");
    setMessage("");
    mapRef.current?.setView([issue.lat, issue.lng], 15);
  };

  const submitFeedback = async () => {
    if (!selected) return;
    if (feedback.trim().length < 3) {
      setMessage("Enter a useful comment before saving.");
      return;
    }
    const updated: Issue = {
      ...selected,
      status,
      feedback: [
        ...(selected.feedback ?? []),
        {
          message: feedback.trim(),
          date: new Date().toISOString().slice(0, 10),
          author: officialName || `${districtName} District Office`,
        },
      ],
    };
    try {
      await saveReport(updated);
      await load();
      setFeedback("");
      setMessage("Status and feedback saved on this device.");
      window.dispatchEvent(new Event("vikassetu:reports-changed"));
    } catch {
      setMessage("The update could not be saved. Please try again.");
    }
  };

  const counts = statuses.map((item) => ({
    label: item,
    value: districtReports.filter((report) => report.status === item).length,
  }));
  return (
    <section
      id="reports"
      className="scroll-mt-20 border-t border-border bg-background"
      aria-labelledby="official-reports-heading"
    >
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <p className="text-xs font-bold uppercase text-primary">District response desk</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="official-reports-heading" className="text-2xl font-bold sm:text-3xl">
              Citizen reports in {districtName}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Review issues saved by citizens on this browser and provide prototype feedback.
            </p>
          </div>
          <span className="rounded-md border border-info-border bg-info px-3 py-2 text-xs font-semibold text-info-foreground">
            Browser-only prototype
          </span>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[{ label: "Total reports", value: districtReports.length }, ...counts].map(
            (item, index) => (
              <div
                key={item.label}
                className="rounded-md border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p
                  className={`mt-1 text-3xl font-bold ${index === 0 ? "text-primary" : "text-foreground"}`}
                >
                  {item.value}
                </p>
              </div>
            ),
          )}
        </div>
        <div className="mt-8 grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="min-w-0 overflow-hidden rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4">
              <h3 className="font-bold">Report queue</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {visible.length} reports match this view
              </p>
            </div>
            <div className="flex gap-1 overflow-x-auto border-b border-border p-2">
              {(["all", ...Object.keys(labels)] as ("all" | Category)[]).map((item) => {
                const Icon = item === "all" ? Navigation : icons[item];
                return (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={filter === item ? "default" : "ghost"}
                    onClick={() => setFilter(item)}
                    className="shrink-0"
                  >
                    <Icon className="size-4!" />
                    {item === "all" ? "All" : labels[item]}
                  </Button>
                );
              })}
            </div>
            {visible.length ? (
              <div className="max-h-[570px] divide-y divide-border overflow-y-auto">
                {visible.map((issue) => (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => selectReport(issue)}
                    className={`block w-full p-4 text-left transition-colors hover:bg-account-selected ${selectedId === issue.id ? "bg-account-selected" : ""}`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <strong className="truncate text-sm">{issue.title}</strong>
                      <span className="shrink-0 rounded-sm bg-secondary px-2 py-1 text-[10px] font-bold text-secondary-foreground">
                        {issue.status}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {issue.id} · {issue.department}
                    </span>
                    <span className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {issue.location}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No citizen reports match this filter.
              </p>
            )}
          </div>
          <div
            id="map"
            className="scroll-mt-20 overflow-hidden rounded-md border border-border bg-card shadow-sm"
          >
            <div className="border-b border-border px-4 py-3">
              <h3 className="font-bold">Report hotspot map</h3>
              <p className="text-xs text-muted-foreground">Select a marker to review its report.</p>
            </div>
            <div className="relative">
              <div
                ref={mapNode}
                role="application"
                aria-label={`${districtName} citizen report map`}
                className="h-[420px] w-full bg-muted lg:h-[500px]"
              />
              {mapError && (
                <div className="absolute inset-0 grid place-items-center bg-muted p-8 text-center text-sm text-muted-foreground">
                  The interactive map is unavailable. Reports remain accessible in the queue.
                </div>
              )}
            </div>
            {selected ? (
              <div id="feedback" className="scroll-mt-20 border-t border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-primary">{selected.id}</p>
                    <h3 className="mt-1 text-lg font-bold">{selected.title}</h3>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedId(undefined)}
                    aria-label="Close selected report"
                  >
                    <X className="size-4!" />
                  </Button>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selected.description}
                </p>
                {selected.photo && (
                  <img
                    src={selected.photo}
                    alt={`Citizen evidence for ${selected.title}`}
                    className="mt-4 h-44 w-full rounded-md object-cover"
                  />
                )}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="official-status">Report status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="official-status" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="official-feedback">Official feedback</Label>
                    <Textarea
                      id="official-feedback"
                      value={feedback}
                      onChange={(event) => {
                        setFeedback(event.target.value);
                        setMessage("");
                      }}
                      placeholder="Add an update for the citizen…"
                      maxLength={500}
                      className="mt-2 min-h-24"
                    />
                  </div>
                </div>
                <Button type="button" onClick={submitFeedback} className="mt-4">
                  <MessageSquare className="size-4!" />
                  Save feedback
                </Button>
                {message && (
                  <p
                    role="status"
                    className="mt-3 flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    {message}
                  </p>
                )}
                {selected.feedback?.length ? (
                  <div className="mt-5 border-t border-border pt-4">
                    <h4 className="text-sm font-bold">Feedback history</h4>
                    {selected.feedback.map((item) => (
                      <div
                        key={`${item.date}-${item.message}`}
                        className="mt-3 rounded-md bg-muted p-3 text-sm"
                      >
                        <p>{item.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.author} · {item.date}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="border-t border-border p-6 text-center text-sm text-muted-foreground">
                Choose a report from the queue or map to add feedback.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
