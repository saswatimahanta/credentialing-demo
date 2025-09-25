// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MoreVertical, User, Send, FileText, CheckCircle, Download, Loader2, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ProviderChatSidebar from '@/components/committee-review/provider-chat-sidebar';

const CommitteeReview = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined;
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    // removed details and checklist dialogs to drop mock/localStorage usage
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [menuProvider, setMenuProvider] = useState(null);
    const [approvalData, setApprovalData] = useState({
        decision: 'approve',
        comments: ''
    });
    const [chatOpen, setChatOpen] = useState(false);
    const [chatProvider, setChatProvider] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsDocsUser, setDetailsDocsUser] = useState<any[]>([]);
    const [detailsDocsPsv, setDetailsDocsPsv] = useState<any[]>([]);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<string | null>(null);
    // Filters modeled like Applications screen
    const defaultFilters = {
        providerId: '',
        name: '',
        status: 'All',
        market: 'All',
        source: 'All',
        assignee: '',
        impact: 'All'
    } as const;
    const [filters, setFilters] = useState({ ...defaultFilters });
    const [draftFilters, setDraftFilters] = useState({ ...defaultFilters });
    const [selected, setSelected] = useState<number[]>([]);

    const handleDraftChange = (key: keyof typeof defaultFilters, value: string) => {
        setDraftFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => setFilters({ ...draftFilters });
    const clearFilters = () => { setDraftFilters({ ...defaultFilters }); setFilters({ ...defaultFilters }); };

    const filteredProviders = providers.filter((p: any) => {
        const pidOk = !filters.providerId || String(p.id).toLowerCase().includes(filters.providerId.toLowerCase());
        const nameOk = !filters.name || String(p.name || '').toLowerCase().includes(filters.name.toLowerCase());
        const statusOk = filters.status === 'All' || (String(p.status || '').toLowerCase() === String(filters.status).toLowerCase());
        const marketOk = filters.market === 'All' || String(p.market || '').toLowerCase() === String(filters.market).toLowerCase();
        const sourceOk = filters.source === 'All' || String(p.source || '').toLowerCase() === String(filters.source).toLowerCase();
        const assigneeOk = !filters.assignee || String(p.assignedAnalyst || '').toLowerCase().includes(filters.assignee.toLowerCase());
        const impactOk = filters.source === 'All' || String(p.impact || '').toLowerCase() === String(filters.impact).toLowerCase();
        const prog = typeof p.progress === 'number' ? p.progress : (p.progress ? Number(p.progress) : 0);
        return pidOk && nameOk && statusOk && marketOk && sourceOk && assigneeOk && impactOk;
    });


    useEffect(() => {
        loadProviders();
    }, []);

    // Lightweight provider shape (subset used in this table)
    interface CommitteeProvider {
        id: string;
        name: string;
        specialty: string;
        market: string;
        status: string;
        assignedAnalyst: string;
        submissionDate: string;
        networkImpact: string;
    }

    const mapApplicationToProvider = (app: any, idx: number): CommitteeProvider => {
        // Map application status values to committee review equivalents
        const statusMap: Record<string, string> = {
            'In-Progress': 'In Progress',
            'Pending Review': 'Under Review',
            'Needs Further Review': 'Committee Review',
            'Completed': 'Approved',
            'Closed': 'Closed'
        };

        const highImpactSpecialties = ['Cardiology', 'Oncology', 'Neurology'];
        const mediumImpactSpecialties = ['Dermatology', 'Pediatrics', 'Orthopedics'];
        let networkImpact = 'Low';
        if (highImpactSpecialties.includes(app.specialty)) networkImpact = 'High';
        else if (mediumImpactSpecialties.includes(app.specialty)) networkImpact = 'Medium';

        // Generate a pseudo submission date (last few days)
        const date = new Date();
        date.setDate(date.getDate() - idx - 1);
        const submissionDate = date.toISOString().split('T')[0];

        return {
            id: app.id,
            name: app.name,
            specialty: app.specialty,
            market: app.market,
            status: statusMap[app.status] || app.status,
            assignedAnalyst: app.assignee || 'Unassigned',
            submissionDate,
            networkImpact
        };
    };

    const committeeStatusToLabel = (code: string | undefined) => {
        if (!code) return undefined;
        const map: Record<string, string> = {
            'IN_REVIEW': 'Under Review',
            'COMMITTEE_REVIEW': 'Committee Review',
            'IN_PROGRESS': 'In Progress',
            'PENDING': 'Pending Review',
            'APPROVED': 'Approved',
            'DENIED': 'Denied',
            'REJECTED': 'Denied',
        };
        return map[String(code).toUpperCase()] || code;
    };

    const deriveNetworkImpact = (specialty?: string) => {
        const high = ['Cardiology', 'Oncology', 'Neurology'];
        const medium = ['Dermatology', 'Pediatrics', 'Orthopedics'];
        if (specialty && high.includes(specialty)) return 'High';
        if (specialty && medium.includes(specialty)) return 'Medium';
        return 'Low';
    };

    const loadProviders = async (): Promise<void> => {
        try {
            const endpointPath = process.env.NEXT_PUBLIC_COMMITTEE_REVIEW_ENDPOINT || '/api/applications/committee-review/';
            const base = API_BASE_URL || '';
            const url = `${base}${endpointPath}`;
            const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
            if (!res.ok) {
                console.warn(`Committee review endpoint returned ${res.status}: ${url}`);
                setProviders([]);
                return;
            }
            const raw = await res.json();
            const arr = Array.isArray(raw) ? raw : (raw?.providers || []);
            const mapped = arr.map((p: any, idx: number) => ({
                id: p.id || p.application_id || p.app_id || `APP-${idx + 1}`,
                providerId: p.providerId,
                name: p.name || p.provider_name || 'Unknown',
                specialty: p.specialty || p.speciality || '—',
                market: p.market || p.location || '—',
                status: committeeStatusToLabel(p.committeeStatus) || p.status || 'Under Review',
                assignedAnalyst: p.assignedAnalyst || p.assignee || 'Unassigned',
                source: p.source || '—',
                submissionDate:
                    p.submissionDate
                    || (p.create_dt ? String(p.create_dt).split('T')[0]
                        : (p.submitted_at ? String(p.submitted_at).split('T')[0]
                            : new Date().toISOString().split('T')[0])),
                networkImpact: p.networkImpact || deriveNetworkImpact(p.specialty),
                progress: typeof p.progress === 'number' ? p.progress : (p.progress ? Number(p.progress) : 0),
                lastUpdated: p.last_updt_dt ? String(p.last_updt_dt).split('T')[0] : undefined,
            }));
            setProviders(mapped);
        } catch (e) {
            console.error('Error loading committee review list:', e);
            setProviders([]);
        }
    };

    const handleMenuOpen = (_event: any, provider: any) => {
        setMenuProvider(provider);
    };

    const handleMenuClose = () => {
        setMenuProvider(null);
    };

    // details and checklist features removed

    const handleStartApproval = (provider: any) => {
        setSelectedProvider(provider);
        setApprovalDialogOpen(true);
        setApprovalData({
            decision: 'approve',
            comments: ''
        });
        handleMenuClose();
    };

    const handleViewDetails = (provider: any) => {
        setSelectedProvider(provider);
        setDetailsOpen(true);
        setDetailsDocsUser([]);
        setDetailsDocsPsv([]);
        setDetailsError(null);
        fetchDetails(provider).catch(() => { });
        handleMenuClose();
    };

    // Image helpers: alias known fileTypes to existing assets and provide fallbacks
    const imageAliasFor = (fileType: string) => {
        const key = (fileType || '').split('/')[0];
        const k = key.toLowerCase();
        const alias: Record<string, string> = {
            // explicit mappings to known assets in /public/images
            'cv': 'CV',
            'npi': 'npi',
            'dea': 'dea',
            'degree': 'degree',
            'dl': 'dl',
            'license_board': 'license_board',
            'board_certification': 'board_certification',
            'medical_training_certificate': 'MEDICAL_TRAINING_CERTIFICATE',
            // malpractice insurance not present; use certificate-of-insurance image
            'malpractice_insurance': 'coi',
            'malpractice': 'coi',
            'coi': 'coi',
        };
        return alias[k] || key;
    };

    const imageCandidates = (fileType: string): string[] => {
        const base = imageAliasFor(fileType);
        const unique = Array.from(new Set([
            `/images/${base}.jpg`,
            `/images/${String(base).toLowerCase()}.jpg`,
            `/images/${base}.png`,
            `/images/${String(base).toLowerCase()}.png`,
        ]));
        return unique;
    };

    const imagePathFor = (fileType: string) => {
        return imageCandidates(fileType)[0];
    };

    const handleImageError = (img: HTMLImageElement, fileType: string) => {
        const attempts = imageCandidates(fileType);
        const step = Number(img.dataset.step || '0');
        if (step < attempts.length - 1) {
            img.dataset.step = String(step + 1);
            img.src = attempts[step + 1];
        } else {
            // hide if no candidate works
            img.style.display = 'none';
        }
    };

    const openPreview = (doc: any) => {
        const src = imagePathFor(doc.fileType);
        setPreviewSrc(src);
        setPreviewTitle(doc.label || doc.fileType);
        setPreviewType(doc.fileType || null);
        setPreviewOpen(true);
    };

    const downloadPreview = () => {
        if (!previewSrc) return;
        const a = document.createElement('a');
        a.href = previewSrc;
        const ext = (() => { const m = previewSrc.split('?')[0].split('#')[0].match(/\.([a-zA-Z0-9]+)$/); return m ? m[1] : 'jpg'; })();
        a.download = (previewTitle || 'document').replace(/\s+/g, '_') + `.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Utilities to fetch documents for details dialog
    const mapKeyToFileType = (key: string): string => {
        const k = (key || '').toUpperCase();
        const mapping: Record<string, string> = {
            'MEDICAL_TRAINING_CERTIFICATE': 'MEDICAL_TRAINING_CERTIFICATE',
            'BOARD_CERTIFICATION': 'board_certification',
            'LICENSE_BOARD': 'license_board',
            'CV': 'CV',
            'RESUME': 'CV',
            'CURRICULUM_VITAE': 'CV',
            'NPI': 'npi',
            'DEA': 'DEA',
            'SANCTIONS': 'sanctions',
            'MALPRACTICE_INSURANCE': 'malpractice_insurance',
            'HOSPITAL_PRIVILEGES': 'hospital_privileges',
            'COI': 'COI',
            'DEGREE': 'degree',
            'TRAINING': 'MEDICAL_TRAINING_CERTIFICATE',
            'WORK_HISTORY': 'work-history',
            'DL': 'dl',
            'DRIVING_LICENSE': 'dl',
            'ML': 'ml',
            'MEDICAL_LICENSE': 'ml',
            'MALPRACTICE': 'malpractice',
            'OTHER': 'other',
        };
        return mapping[k] || (key || '').toLowerCase();
    };

    const formatFileTypeLabel = (ft: string): string => {
        const key = (ft || '').toLowerCase();
        const labels: Record<string, string> = {
            'board_certification': 'Board Certification',
            'license_board': 'License Board',
            'medical_training_certificate': 'Medical Training Certificate',
            'cv': 'CV',
            'npi': 'NPI',
            'dea': 'DEA',
            'sanctions': 'Sanctions',
            'malpractice_insurance': 'Malpractice Insurance',
            'hospital_privileges': 'Hospital Privileges',
            'coi': 'COI',
            'degree': 'Degree',
            'work-history': 'Work History',
            'dl': 'Driver License',
            'ml': 'Medical License',
            'malpractice': 'Malpractice',
            'other': 'Other',
        };
        return labels[key] || (ft || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const normalizeFiles = (files: any): any[] => {
        if (!files) return [];
        const entries: Array<[string, any]> = Array.isArray(files)
            ? files.map((f: any) => [f.fileType || f.type || 'unknown', f])
            : Object.entries(files);

        return entries.map(([rawKey, f]) => {
            const fileType = mapKeyToFileType(f?.fileType || rawKey);
            const verificationObj = f?.verificationDetails && typeof f?.verificationDetails === 'object'
                ? f?.verificationDetails
                : (typeof f?.verification === 'object' ? f?.verification : {});

            const pf = verificationObj?.pdf_format_match;
            let pdfMatchNormalized: any = {};
            if (pf !== undefined) {
                if (typeof pf === 'string') pdfMatchNormalized.match = /match|verified/i.test(pf);
                else if (typeof pf === 'boolean') pdfMatchNormalized.match = pf;
            }
            if (pdfMatchNormalized.match === undefined && typeof f?.verification === 'string') {
                pdfMatchNormalized.match = /verification|verified|match/i.test(f?.verification);
            }
            pdfMatchNormalized.reason = verificationObj?.verification_summary || verificationObj?.comment || verificationObj?.comment_1 || verificationObj?.comment_2 || (typeof f?.verification === 'string' ? f?.verification : undefined);

            return {
                fileType,
                label: formatFileTypeLabel(fileType),
                filename: f?.filename ?? null,
                status: (f?.status as any) || 'Pending',
                progress: typeof f?.progress === 'number' ? f.progress : 0,
                ocrData: f?.ocrData || f?.ocr || {},
                pdfMatch: pdfMatchNormalized,
                comments: f?.comments || [],
                verificationDetails: Object.keys(verificationObj || {}).length ? verificationObj : (f?.verificationDetails || f?.verification_details || null),
            };
        });
    };

    const fetchDetails = async (provider: any) => {
        try {
            setDetailsLoading(true);
            const appId = provider?.id;
            const base = API_BASE_URL || '';
            // 1) Get form data to discover uploadIds
            const formsRes = await fetch(`${base}/api/forms/?appId=${encodeURIComponent(appId)}&formId=`, { cache: 'no-store' });
            if (!formsRes.ok) throw new Error(`Forms load ${formsRes.status}`);
            const formJson = await formsRes.json();
            const uploadIds = Object.entries(formJson)
                .filter(([key]) => (key as string).endsWith('-upload-id'))
                .map(([_, value]) => value)
                .filter(Boolean) as string[];

            const query = `appId=${encodeURIComponent(appId)}&formId=&uploadIds=${encodeURIComponent(uploadIds.join(','))}`;
            // 2) Fetch both user uploaded and PSV fetched
            const [uRes, psvRes] = await Promise.allSettled([
                fetch(`${base}/api/forms/upload-info?${query}`, { cache: 'no-store' }),
                fetch(`${base}/api/forms/upload-info-psv?${query}`, { cache: 'no-store' })
            ]);

            const uData = (uRes.status === 'fulfilled' && uRes.value.ok) ? await uRes.value.json() : { files: {} };
            const psvData = (psvRes.status === 'fulfilled' && psvRes.value.ok) ? await psvRes.value.json() : { files: {} };

            const userDocs = normalizeFiles(uData.files);
            const psvDocs = normalizeFiles(psvData.files);
            setDetailsDocsUser(userDocs);
            setDetailsDocsPsv(psvDocs);
            setDetailsError(null);
        } catch (err: any) {
            console.error('Details load failed', err);
            setDetailsDocsUser([]);
            setDetailsDocsPsv([]);
            setDetailsError('Failed to load documents/verification info');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDownloadDoc = async (type: string) => {
        try {
            const appId = selectedProvider?.id;
            const res = await fetch(`${API_BASE_URL}/api/documents/download?id=${encodeURIComponent(appId)}&type=${encodeURIComponent(type)}`);
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type.toUpperCase()}_${appId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Download error', e);
        }
    };

    const handleGenerateReport = async (provider: any) => {
        setSelectedProvider(provider);
        setReportDialogOpen(true);
        setReportLoading(true);
        setReportError(null);
        setReportData(null);

        try {
            const hardcodedId = 'APP-1073';
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/report/${hardcodedId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const raw = await response.json();
            // Normalize possible response shapes
            const normalized = {
                ...raw,
                report_content: raw.report_content || raw.report || raw.reportContent || '',
                provider_name: raw.provider_name || raw.providerName || selectedProvider?.name || 'Provider',
                provider_id: raw.provider_id || raw.meta?.provider_id || undefined
            };
            console.log('Report data (normalized):', normalized);
            setReportData(normalized);
        } catch (error) {
            console.error('Error generating report:', error);
            setReportError('Failed to generate credentialing report. Please try again.');
        } finally {
            setReportLoading(false);
        }
        handleMenuClose();
    };

    const handleOpenChat = (provider: any) => {
        setChatProvider(provider);
        setChatOpen(true);
        handleMenuClose();
    };

    const handleChatClose = () => {
        setChatOpen(false);
        setChatProvider(null);
    };

    const handleApprovalSubmit = () => {
        if (selectedProvider && approvalData.comments.trim()) {
            // Update provider status
            const updatedStatus = approvalData.decision === 'approve' ? 'Approved' : 'Denied';
            // Update local UI state only (no mock/localStorage)
            setProviders(prev => prev.map((p: any) => p.id === selectedProvider.id ? { ...p, status: updatedStatus } : p));

            setApprovalDialogOpen(false);
            loadProviders(); // Refresh the list
        }
    };

    const handleReportClose = () => {
        setReportDialogOpen(false);
        setReportData(null);
        setReportError(null);
    };

    const downloadReport = () => {
        if (reportData && reportData.report_content) {
            const blob = new Blob([reportData.report_content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const safeName = (reportData.provider_name || selectedProvider?.name || 'credentialing_report').replace(/[^a-z0-9]+/gi, '_');
            link.download = `${safeName}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const statusVariant = (status: string) => {
        const s = (status || '').toLowerCase();
        if (s === 'approved') return 'default' as const;
        if (s === 'denied') return 'destructive' as const;
        if (s === 'under review' || s === 'committee review') return 'secondary' as const;
        if (s === 'in progress') return 'outline' as const;
        return 'secondary' as const;
    };

    const handleCheckboxClick = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelected(filteredProviders.map((p: any) => p.id));
        } else {
            setSelected(prev =>
                prev.filter(id => !filteredProviders.some((p: any) => p.id === id))
            );
        }
    };
    const [organization, setOrganization] = useState('none');

    const handleApprove = () => {
        if (selected.length === 0) return;

        const updatedProviders = providers.map((p: any) =>
            selected.includes(p.id)
                ? { ...p, status: "Approved" }
                : p
        );

        setProviders(updatedProviders);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Committee Review</CardTitle>
                <CardDescription>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p>Review and approve provider credentialing applications</p>
                        <div className="flex items-center gap-3">
                            <Select value={organization} onValueChange={setOrganization}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="org1">Org 1</SelectItem>
                                    <SelectItem value="org2">Org 2</SelectItem>
                                    <SelectItem value="org3">Org 3</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant={selected.length > 0 ? 'default' : 'ghost'} onClick={handleApprove}>
                                Approve
                            </Button>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline">Filters</Button>
                        <Button variant="outline">Export</Button>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Provider ID</label>
                                <Input placeholder="e.g., 1001" value={draftFilters.providerId} onChange={(e) => handleDraftChange('providerId', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Name</label>
                                <Input placeholder="Search name" value={draftFilters.name} onChange={(e) => handleDraftChange('name', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Status</label>
                                <Select value={draftFilters.status} onValueChange={(v) => handleDraftChange('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Under Review">Under Review</SelectItem>
                                        <SelectItem value="Committee Review">Committee Review</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Denied">Denied</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Market</label>
                                <Select value={draftFilters.market} onValueChange={(v) => handleDraftChange('market', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="CA">CA</SelectItem>
                                        <SelectItem value="NY">NY</SelectItem>
                                        <SelectItem value="TX">TX</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* <div>
                                <label className="text-sm text-muted-foreground">Source</label>
                                <Select value={draftFilters.source} onValueChange={(v) => handleDraftChange('source', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Manual Entry">Manual Entry</SelectItem>
                                        <SelectItem value="PSV Fetched">PSV Fetched</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}
                            <div>
                                <label className="text-sm text-muted-foreground">Assignee</label>
                                <Input placeholder="Type a name" value={draftFilters.assignee} onChange={(e) => handleDraftChange('assignee', e.target.value)} />
                            </div>
                           <div>
                                <label className="text-sm text-muted-foreground">Network Impact</label>
                                <Select value={draftFilters.impact} onValueChange={(v) => handleDraftChange('impact', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={clearFilters}>Clear</Button>
                            <Button onClick={applyFilters}>Apply</Button>
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="text-left">
                                        <th className="w-10 px-3 py-2">
                                            <Checkbox
                                                checked={filteredProviders.length > 0 && filteredProviders.every((p: any) => selected.includes(p.id))}
                                                onCheckedChange={(v) => {
                                                    if (v) setSelected(filteredProviders.map((p: any) => p.id));
                                                    else setSelected([]);
                                                }}
                                            />
                                        </th>
                                        <th className="px-3 py-2">Provider ID</th>
                                        <th className="px-3 py-2">Provider</th>
                                        <th className="px-3 py-2">Specialty</th>
                                        <th className="px-3 py-2">Market</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Assigned Analyst</th>
                                        <th className="px-3 py-2">Submission Date</th>
                                        <th className="px-3 py-2">Network Impact</th>
                                        <th className="px-3 py-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProviders.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-center text-sm text-muted-foreground" colSpan={9}>
                                                No providers available.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredProviders.map((provider: any) => {
                                        const isChecked = selected.includes(provider.id);
                                        return (
                                            <tr key={provider.id} className="border-t">
                                                <td className="px-3 py-2">
                                                    <Checkbox checked={isChecked} onCheckedChange={() => handleCheckboxClick(provider.id)} />
                                                </td>
                                                <td className="px-3 py-2">{provider.providerId}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{provider.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">{provider.specialty}</td>
                                                <td className="px-3 py-2">{provider.market}</td>
                                                <td className="px-3 py-2">
                                                    <Badge variant={statusVariant(provider.status)}>{provider.status}</Badge>
                                                </td>
                                                <td className="px-3 py-2">{provider.assignedAnalyst}</td>
                                                <td className="px-3 py-2">{provider.submissionDate}</td>
                                                <td className="px-3 py-2">
                                                    <Badge variant={provider.networkImpact === 'High' ? 'destructive' : provider.networkImpact === 'Medium' ? 'secondary' : 'outline'}>
                                                        {provider.networkImpact}
                                                    </Badge>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={(e) => handleMenuOpen(e, provider)}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44">
                                                            <DropdownMenuItem onClick={() => handleViewDetails(menuProvider || provider)}>
                                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleGenerateReport(menuProvider || provider)}>
                                                                <FileText className="mr-2 h-4 w-4" /> Generate Report
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOpenChat(menuProvider || provider)}>
                                                                <User className="mr-2 h-4 w-4" /> Chat with AI
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleStartApproval(menuProvider || provider)}>
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve/Deny
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Details and checklist dialogs removed */}
                    {/* Provider Details Dialog with Tabs */}
                    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                        <DialogContent className="max-w-6xl max-h-[85vh]">
                            <DialogHeader>
                                <DialogTitle>{selectedProvider?.name}</DialogTitle>
                                <DialogDescription>
                                    {selectedProvider?.specialty} {selectedProvider?.market ? `• ${selectedProvider?.market}` : ''}
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[65vh] pr-2">
                                <Tabs defaultValue="overview">
                                    <TabsList>
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="documents">Documents</TabsTrigger>
                                        <TabsTrigger value="verification">Verification</TabsTrigger>
                                        <TabsTrigger value="history">History</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="overview">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-2 space-y-4">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-base">Provider Information</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-muted-foreground">Full Name</p>
                                                            <p className="font-medium">{selectedProvider?.name}</p>
                                                        </div>
                                                        {/* Provider ID hidden per request */}
                                                        <div>
                                                            <p className="text-muted-foreground">Specialty</p>
                                                            <p className="font-medium">{selectedProvider?.specialty || '—'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Market</p>
                                                            <p className="font-medium">{selectedProvider?.market || '—'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Network Impact</p>
                                                            <Badge variant={selectedProvider?.networkImpact === 'High' ? 'destructive' : selectedProvider?.networkImpact === 'Medium' ? 'secondary' : 'outline'}>
                                                                {selectedProvider?.networkImpact}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Status</p>
                                                            <Badge variant={statusVariant(selectedProvider?.status || '')}>{selectedProvider?.status}</Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-base">Case Management</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-muted-foreground">Assigned Analyst</p>
                                                                <p className="font-medium">{selectedProvider?.assignedAnalyst || 'Unassigned'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground">Submission Date</p>
                                                                <p className="font-medium">{selectedProvider?.submissionDate || '—'}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div className="space-y-4">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-base">Progress Overview</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">Checklist Completion</p>
                                                        <Progress value={typeof (selectedProvider as any)?.progress === 'number' ? (selectedProvider as any)?.progress : 0} />
                                                        <div className="text-xs text-muted-foreground">Last Updated: {selectedProvider?.lastUpdated || 'Not updated'}</div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="documents">
                                        {detailsLoading ? (
                                            <div className="text-sm text-muted-foreground">Loading documents…</div>
                                        ) : detailsError ? (
                                            <div className="text-sm text-destructive">{detailsError}</div>
                                        ) : (
                                            <Accordion type="multiple" className="w-full">
                                                <AccordionItem value="user-submitted">
                                                    <AccordionTrigger>Provider Submitted ({detailsDocsUser.length})</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {detailsDocsUser.length === 0 && (
                                                                <div className="text-sm text-muted-foreground">No provider-submitted documents.</div>
                                                            )}
                                                            {detailsDocsUser.map((doc, idx) => {
                                                                const isNpi = String(doc?.fileType || '').toLowerCase() === 'npi';
                                                                return (
                                                                    <Card key={`u-${doc.fileType}-${idx}`}>
                                                                        <CardHeader className="pb-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <CardTitle className="text-base">{doc.label}</CardTitle>
                                                                                <Badge variant={/verified|complete/i.test(doc.status) ? 'default' : /pending|in progress/i.test(doc.status) ? 'secondary' : 'outline'}>
                                                                                    {doc.status || '—'}
                                                                                </Badge>
                                                                            </div>
                                                                        </CardHeader>
                                                                        <CardContent className="space-y-2">
                                                                            {!isNpi && (
                                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                                <img
                                                                                    src={imagePathFor(doc.fileType)}
                                                                                    alt={doc.label}
                                                                                    className="h-24 w-full rounded border object-cover cursor-pointer"
                                                                                    onClick={() => openPreview(doc)}
                                                                                    onError={(e) => handleImageError(e.currentTarget as HTMLImageElement, doc.fileType)}
                                                                                />
                                                                            )}
                                                                            <div className="flex items-center justify-end gap-2">
                                                                                {!isNpi && (
                                                                                    <Button size="icon" variant="ghost" onClick={() => openPreview(doc)}>
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </Button>
                                                                                )}
                                                                                <Button size="icon" variant="ghost" onClick={() => handleDownloadDoc(doc.fileType)}>
                                                                                    <Download className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                );
                                                            })}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="psv-fetched">
                                                    <AccordionTrigger>PSV Fetched ({detailsDocsPsv.length})</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {detailsDocsPsv.length === 0 && (
                                                                <div className="text-sm text-muted-foreground">No PSV-fetched documents.</div>
                                                            )}
                                                            {detailsDocsPsv.filter(doc => String(doc?.fileType || '').toLowerCase() != 'npi').map((doc, idx) => {
                                                                const isNpi = String(doc?.fileType || '').toLowerCase() === 'npi';
                                                                return (
                                                                    <Card key={`p-${doc.fileType}-${idx}`}>
                                                                        <CardHeader className="pb-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <CardTitle className="text-base">{doc.label}</CardTitle>
                                                                                <Badge variant={/verified|complete/i.test(doc.status) ? 'default' : /pending|in progress/i.test(doc.status) ? 'secondary' : 'outline'}>
                                                                                    {doc.status || '—'}
                                                                                </Badge>
                                                                            </div>
                                                                        </CardHeader>
                                                                        <CardContent className="space-y-2">
                                                                            {!isNpi && (
                                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                                <img
                                                                                    src={imagePathFor(doc.fileType)}
                                                                                    alt={doc.label}
                                                                                    className="h-24 w-full rounded border object-cover cursor-pointer"
                                                                                    onClick={() => openPreview(doc)}
                                                                                    onError={(e) => handleImageError(e.currentTarget as HTMLImageElement, doc.fileType)}
                                                                                />
                                                                            )}
                                                                            <div className="flex items-center justify-end gap-2">
                                                                                {!isNpi && (
                                                                                    <Button size="icon" variant="ghost" onClick={() => openPreview(doc)}>
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </Button>
                                                                                )}
                                                                                <Button size="icon" variant="ghost" onClick={() => handleDownloadDoc(doc.fileType)}>
                                                                                    <Download className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                );
                                                            })}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="verification">
                                        {detailsLoading ? (
                                            <div className="text-sm text-muted-foreground">Loading verification…</div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {[...detailsDocsUser, ...detailsDocsPsv]
                                                    .filter(d => d.verificationDetails || d.verification || d.pdfMatch)
                                                    .map((doc, idx) => {
                                                        const key = doc.fileType;
                                                        const verified = /verified|match|complete|passed/i.test(String(doc?.status || '')) || doc?.pdfMatch?.match === true || /match|verified|passed/i.test(String(doc?.verificationDetails?.pdf_format_match || ''));
                                                        const lastChecked = doc?.verificationDetails?.last_checked || doc?.verificationDetails?.lastChecked;
                                                        const highlightKeys = ['pdf_format_match', 'license_number_match', 'board_certificate_match', 'provider_name_match', 'certification_status', 'dea_verification', 'verification_status', 'source'];
                                                        const highlights = highlightKeys
                                                            .filter(k => doc?.verificationDetails && doc.verificationDetails[k] !== undefined)
                                                            .slice(0, 3)
                                                            .map(k => `${k.replace(/_/g, ' ')}: ${String(doc.verificationDetails[k])}`);

                                                        return (
                                                            <Card key={`ver-${key}-${idx}`}>
                                                                <CardHeader>
                                                                    <CardTitle className="text-base">{formatFileTypeLabel(key)}</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-1 text-sm">
                                                                    <div>Status: {verified ? 'verified' : (doc?.status || 'pending')}</div>
                                                                    <div>Last Checked: {lastChecked || '—'}</div>
                                                                    {highlights.length > 0 && (
                                                                        <div className="text-muted-foreground">{highlights.join(' • ')}</div>
                                                                    )}
                                                                    {doc?.pdfMatch?.reason && (
                                                                        <div className="text-muted-foreground">{doc?.pdfMatch?.reason}</div>
                                                                    )}
                                                                    <div className="pt-2">
                                                                        <Button size="sm" variant="outline" onClick={() => handleDownloadDoc(doc.fileType)}>Download</Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="history">
                                        <div className="space-y-3 text-sm">
                                            <div className="text-muted-foreground">Recent activity</div>
                                            <ul className="space-y-2">
                                                <li>
                                                    <div className="flex items-center justify-between">
                                                        <span>Moved to Committee Review</span>
                                                        <span className="text-muted-foreground">{selectedProvider?.submissionDate || '—'}</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="flex items-center justify-between">
                                                        <span>Assigned to {selectedProvider?.assignedAnalyst || 'Analyst'}</span>
                                                        <span className="text-muted-foreground">{new Date().toISOString().split('T')[0]}</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="flex items-center justify-between">
                                                        <span>PSV completed</span>
                                                        <span className="text-muted-foreground">—</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </ScrollArea>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Image Preview Dialog */}
                    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>{previewTitle}</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[70vh] pr-2">
                                {previewSrc ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={previewSrc} alt={String(previewTitle || '')} className="w-full rounded border" onError={(e) => handleImageError(e.currentTarget as HTMLImageElement, String(previewType || ''))} />
                                ) : (
                                    <div className="text-sm text-muted-foreground">No preview available.</div>
                                )}
                            </ScrollArea>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
                                {previewSrc && (
                                    <Button onClick={downloadPreview}><Download className="mr-2 h-4 w-4" /> Download</Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Approval Dialog */}
                    <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Review Application - {selectedProvider?.name}</DialogTitle>
                                <DialogDescription>Choose your decision and provide comments.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Decision</label>
                                    <Select value={approvalData.decision} onValueChange={(v) => setApprovalData({ ...approvalData, decision: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a decision" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approve">Approve</SelectItem>
                                            <SelectItem value="deny">Deny</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="comments">Comments</label>
                                    <textarea
                                        id="comments"
                                        className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={approvalData.comments}
                                        onChange={(e) => setApprovalData({ ...approvalData, comments: e.target.value })}
                                        placeholder="Provide reasoning for your decision"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleApprovalSubmit} disabled={!approvalData.comments.trim()}>
                                    <Send className="mr-2 h-4 w-4" /> {approvalData.decision === 'approve' ? 'Approve' : 'Deny'} Application
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Credentialing Report Dialog */}
                    <Dialog open={reportDialogOpen} onOpenChange={(open) => { if (!open) handleReportClose(); }}>
                        <DialogContent className="max-w-5xl min-h-[70vh]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle>Credentialing Report</DialogTitle>
                                    <DialogDescription>
                                        {reportData ? (reportData.provider_name || selectedProvider?.name || '') : (selectedProvider?.name || '')}
                                    </DialogDescription>
                                </div>
                                {reportData && (
                                    <Button variant="outline" onClick={downloadReport}>
                                        <Download className="mr-2 h-4 w-4" /> Download Report
                                    </Button>
                                )}
                            </div>
                            <Separator />
                            {reportLoading && (
                                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating credentialing report...
                                </div>
                            )}
                            {reportError && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                                    {reportError}
                                </div>
                            )}
                            {reportData && reportData.report_content && (
                                <ScrollArea className="h-[60vh]">
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                        <ReactMarkdown>{reportData.report_content}</ReactMarkdown>
                                    </div>
                                </ScrollArea>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={handleReportClose}>Close</Button>
                                {reportData && reportData.report_content && (
                                    <Button onClick={downloadReport}>
                                        <Download className="mr-2 h-4 w-4" /> Download Report
                                    </Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Provider Chat Sidebar */}
                    <ProviderChatSidebar open={chatOpen} onClose={handleChatClose} provider={chatProvider} />
                </div>
            </CardContent>
        </Card>
    );
};

export default CommitteeReview;
