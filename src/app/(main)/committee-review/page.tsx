// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import {
    Box,
    Paper,
    Typography,
    // Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Menu,
    Divider,
    Alert,
    CircularProgress,
    Checkbox,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon,
    Send as SendIcon,
    Assessment as AssessmentIcon,
    CheckCircle as CheckCircleIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select as CnSelect,
    SelectContent as CnSelectContent,
    SelectItem as CnSelectItem,
    SelectTrigger as CnSelectTrigger,
    SelectValue as CnSelectValue
} from '@/components/ui/select';
import { Button as CnButton } from '@/components/ui/button';
import mockDatabase from '@/components/committee-review/mockDatabase';
import api from '@/lib/mock-data';
import ProviderDetailsDialog from '@/components/committee-review/provider-details-dialog';
import ChecklistManager from '@/components/committee-review/checklist-manager';
import ProviderChatSidebar from '@/components/committee-review/provider-chat-sidebar';
import { Card,CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import CommitteeReviewTable from '@/components/committee-review/committee-review-table';
import { ListFilter } from 'lucide-react';


const CommitteeReview = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuProvider, setMenuProvider] = useState(null);
    const [showFilters, setShowFilters] = useState(true);
    const [approvalData, setApprovalData] = useState({
        decision: 'approve',
        comments: ''
    });
    const [chatOpen, setChatOpen] = useState(false);
    const [chatProvider, setChatProvider] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState(null);
    // const [filters, setFilters] = useState({
    //     specialty: "",
    //     market: "",
    //     status: "",
    //     analyst: "",
    //     networkImpact: "",
    // });
    const [selected, setSelected] = useState<number[]>([]);
    const [filters, setFilters] = useState({
        providerName: "",   // maps to provider.name
        specialty: "all",      // maps to provider.specialty
        market: "all",         // maps to provider.market
        status: "all",         // maps to provider.status
        assignedAnalyst: "all",// maps to provider.assignedAnalyst
        networkImpact: "all"   // maps to provider.networkImpact
    });

    const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredProviders = providers.filter((p) =>
        (filters.providerName === "all" || p.name.toLowerCase().includes(filters.providerName.toLowerCase())) &&
        (filters.specialty === "all" || p.specialty.toLowerCase() === filters.specialty.toLowerCase()) &&
        (filters.market === "all" || p.market.toLowerCase() === filters.market.toLowerCase()) &&
        (filters.status === "all" || p.status.toLowerCase() === filters.status.toLowerCase()) &&
        (filters.assignedAnalyst === "all" || p.assignedAnalyst.toLowerCase() === filters.assignedAnalyst.toLowerCase()) &&
        (filters.networkImpact === "all" || p.networkImpact.toLowerCase() === filters.networkImpact.toLowerCase())
    );

    useEffect(()=>{console.log(filteredProviders)}, [providers])

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

    const loadProviders = async (): Promise<void> => {
        try {
            // Attempt to load first 5 applications as providers (DB source)
            const applications = await api.getApplications();
            const mapped = applications
                .filter(app => ['In-Progress', 'Pending Review', 'Needs Further Review', 'Completed'].includes(app.status))
                .slice(0, 5)
                .map((app, idx) => mapApplicationToProvider(app, idx));

            if (mapped.length > 0) {
                const customProvider = {
                    id: 'APP-1073',
                    name: 'Dr. Munther A Hijazin',
                    specialty: mapped[0]?.specialty || 'Cardiology',
                    market: mapped[0]?.market || 'California',
                    status: 'Committee Review',
                    assignedAnalyst: 'Bob Williams',
                    submissionDate: new Date().toISOString().split('T')[0],
                    networkImpact: 'High'
                };
                setProviders([customProvider, ...mapped]);
                return;
            }
        } catch (e) {
            console.warn('Falling back to mockDatabase providers due to error loading applications', e);
        }

        // Fallback: original mock providers (filter & take first 5)
        const allProviders = mockDatabase.getProviders();
        const reviewProviders = allProviders.filter(p =>
            p.status === 'Under Review' || p.status === 'Committee Review' || p.status === 'In Progress'
        ).slice(0, 5);
        setProviders(reviewProviders);
    };

    const handleMenuOpen = (event: any, provider: any) => {
        console.log('Opening menu for:', provider);
        setAnchorEl(event.currentTarget);
        setMenuProvider(provider);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuProvider(null);
    };

    const handleViewDetails = (provider: any) => {
        if (!provider) return;
        console.log('clicked view details')
        setSelectedProvider(provider);
        setDetailsDialogOpen(true);
        // handleMenuClose();
    };

    const handleViewChecklist = (provider: any) => {
        setSelectedProvider(provider);
        setChecklistDialogOpen(true);
        handleMenuClose();
    };

    const handleStartApproval = (provider: any) => {
        setSelectedProvider(provider);
        setApprovalDialogOpen(true);
        setApprovalData({
            decision: 'approve',
            comments: ''
        });
        handleMenuClose();
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
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const raw = await response.json();
            // Normalize possible response shapes
            const normalized = {
                ...raw,
                report_content: raw.report_content || raw.report || raw.reportContent || '',
                provider_name: raw.provider_name || raw.providerName || selectedProvider?.name || 'Dr. Munther A Hijazin',
                provider_id: raw.provider_id || raw.meta?.provider_id || 'APP-1073'
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
            mockDatabase.updateProvider(selectedProvider.id, {
                status: updatedStatus,
                approvalComments: approvalData.comments,
                approvalDate: new Date().toISOString().split('T')[0],
                approvedBy: 'Current User' // In real app, get from auth context
            });

            // Add audit log
            mockDatabase.addAuditLog({
                providerId: selectedProvider.id,
                providerName: selectedProvider.name,
                action: `Application ${approvalData.decision === 'approve' ? 'Approved' : 'Denied'}`,
                user: 'Current User',
                details: {
                    decision: approvalData.decision,
                    comments: approvalData.comments
                }
            });

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
            link.download = `credentialing_report_${reportData.provider_id || 'unknown'}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'success';
            case 'denied': return 'error';
            case 'under review':
            case 'committee review': return 'warning';
            case 'in progress': return 'info';
            default: return 'default';
        }
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
    const [organization, setOrganization] = useState('');

    const handleChange = (event) => {
        setOrganization(event.target.value);
    };

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
                <CardTitle>
                    Committee Review
                </CardTitle>
                <CardDescription>
                    <div className='flex justify-between'>
                        <p>Review and approve provider credentialing applications</p>
                        <div className='flex justify-center items-center gap-4'>
                            <CnButton variant="outline" size="sm" className="h-10 gap-1" onClick={() => setShowFilters(v => !v)}>
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filters</span>
                            </CnButton>
                            <CnSelect
                                value='Organizations'
                            >
                                <CnSelectTrigger><CnSelectValue placeholder="Organizations" /></CnSelectTrigger>
                                <CnSelectContent>
                                <CnSelectItem value="Organizations">Organizations</CnSelectItem>
                                <CnSelectItem value="Cardiology">Cardiology</CnSelectItem>
                                <CnSelectItem value="Oncology">Oncology</CnSelectItem>
                                <CnSelectItem value="Dermatology">Dermatology</CnSelectItem>
                                </CnSelectContent>
                            </CnSelect>
                            <Button
                                variant={selected.length > 0 ? "default" : "ghost"}
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>

                        </div>
                    </div>
                </CardDescription>

            </CardHeader>
            <CardContent>
                {showFilters && <div className="mb-4 rounded-md border p-4 bg-muted/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                            <Label htmlFor="f-provider">Provider Name</Label>
                            <Input
                                id="f-provider"
                                value={filters.providerName}
                                onChange={(e) => setFilters({ ...filters, providerName: e.target.value })}
                                placeholder="e.g., Dr. Smith"
                            />
                            </div>

                            <div>
                            <Label>Specialty</Label>
                            <CnSelect
                                value={filters.specialty}
                                onValueChange={(v) => setFilters({ ...filters, specialty: v })}
                            >
                                <CnSelectTrigger><CnSelectValue placeholder="All Specialties" /></CnSelectTrigger>
                                <CnSelectContent>
                                <CnSelectItem value="all">All</CnSelectItem>
                                <CnSelectItem value="Cardiology">Cardiology</CnSelectItem>
                                <CnSelectItem value="Oncology">Oncology</CnSelectItem>
                                <CnSelectItem value="Dermatology">Dermatology</CnSelectItem>
                                </CnSelectContent>
                            </CnSelect>
                            </div>

                            <div>
                            <Label>Market</Label>
                            <CnSelect
                                value={filters.market}
                                onValueChange={(v) => setFilters({ ...filters, market: v })}
                            >
                                <CnSelectTrigger><CnSelectValue placeholder="All Markets" /></CnSelectTrigger>
                                <CnSelectContent>
                                <CnSelectItem value="all">All</CnSelectItem>
                                <CnSelectItem value="California">California</CnSelectItem>
                                <CnSelectItem value="Texas">Texas</CnSelectItem>
                                <CnSelectItem value="Florida">Florida</CnSelectItem>
                                </CnSelectContent>
                            </CnSelect>
                            </div>

                            <div>
                            <Label>Status</Label>
                            <CnSelect
                                value={filters.status}
                                onValueChange={(v) => setFilters({ ...filters, status: v })}
                            >
                                <CnSelectTrigger><CnSelectValue placeholder="All Statuses" /></CnSelectTrigger>
                                <CnSelectContent>
                                <CnSelectItem value="all">All</CnSelectItem>
                                <CnSelectItem value="In Progress">In Progress</CnSelectItem>
                                <CnSelectItem value="Committee Review">Committee Review</CnSelectItem>
                                <CnSelectItem value="Approved">Approved</CnSelectItem>
                                <CnSelectItem value="Denied">Denied</CnSelectItem>
                                </CnSelectContent>
                            </CnSelect>
                            </div>

                            <div>
                            <Label>Assigned Analyst</Label>
                            <CnSelect
                                value={filters.assignedAnalyst}
                                onValueChange={(v) => setFilters({ ...filters, assignedAnalyst: v })}
                            >
                                <CnSelectTrigger><CnSelectValue placeholder="All Analysts" /></CnSelectTrigger>
                                <CnSelectContent>
                                <CnSelectItem value="all">All</CnSelectItem>
                                <CnSelectItem value="Bob Williams">Bob Williams</CnSelectItem>
                                <CnSelectItem value="Alice Smith">Alice Smith</CnSelectItem>
                                </CnSelectContent>
                            </CnSelect>
                            </div>

                            <div>
                            <Label>Network Impact</Label>
                            <CnSelect
                                value={filters.networkImpact}
                                onValueChange={(v) => setFilters({ ...filters, networkImpact: v })}
                            >
                                <CnSelectTrigger><CnSelectValue placeholder="All Impacts" /></CnSelectTrigger>
                                <CnSelectContent>
                                <CnSelectItem value="all">All</CnSelectItem>
                                <CnSelectItem value="High">High</CnSelectItem>
                                <CnSelectItem value="Medium">Medium</CnSelectItem>
                                <CnSelectItem value="Low">Low</CnSelectItem>
                                </CnSelectContent>
                            </CnSelect>
                            </div>


                    </div>
                    <div className="mt-3 flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilters({
                                providerName: "",
                                specialty: "all",
                                market: "all",
                                status: "all",
                                assignedAnalyst: "all",
                                networkImpact: "all"
                                });
                            }}
                            >
                            Clear
                        </Button>
                        <Button onClick={() => setShowFilters(false)}>Apply</Button>
                    </div>
                </div>}
            <Box>
                <CommitteeReviewTable
                    filteredProviders={filteredProviders}
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                    handleCheckboxClick={handleCheckboxClick}
                    handleMenuOpen={handleMenuOpen}
                    getStatusColor={getStatusColor}
                    handleViewDetails={handleViewDetails}
                    handleGenerateReport={handleGenerateReport}
                    handleOpenChat={handleOpenChat}
                    handleStartApproval={handleStartApproval}
                />

                {/* Provider Details Dialog */}
                <ProviderDetailsDialog
                    open={detailsDialogOpen}
                    onClose={() => setDetailsDialogOpen(false)}
                    provider={selectedProvider}
                    onUpdate={() => loadProviders()}
                />

                {/* Checklist Manager Dialog */}
                <Dialog
                    open={checklistDialogOpen}
                    onClose={() => setChecklistDialogOpen(false)}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        Provider Checklist - {selectedProvider?.name}
                    </DialogTitle>
                    <DialogContent>
                        {selectedProvider && (
                            <ChecklistManager
                                provider={selectedProvider}
                                onUpdate={() => {
                                    loadProviders();
                                    setChecklistDialogOpen(false);
                                }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setChecklistDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Approval Dialog */}
                <Dialog
                    open={approvalDialogOpen}
                    onClose={() => setApprovalDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Review Application - {selectedProvider?.name}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Decision</InputLabel>
                                <Select
                                    value={approvalData.decision}
                                    onChange={(e: any) => setApprovalData({
                                        ...approvalData,
                                        decision: e.target.value
                                    })}
                                    label="Decision"
                                >
                                    <MenuItem value="approve">Approve</MenuItem>
                                    <MenuItem value="deny">Deny</MenuItem>
                                </Select>



                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Comments"
                                value={approvalData.comments}
                                onChange={(e) => setApprovalData({
                                    ...approvalData,
                                    comments: e.target.value
                                })}
                                required
                                helperText="Please provide reasoning for your decision"
                            />
                            </FormControl>
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setApprovalDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleApprovalSubmit}
                            color={approvalData.decision === 'approve' ? 'success' : 'error'}
                            startIcon={<SendIcon />}
                            disabled={!approvalData.comments.trim()}
                        >
                            {approvalData.decision === 'approve' ? 'Approve' : 'Deny'} Application
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Credentialing Report Dialog */}
                <Dialog
                    open={reportDialogOpen}
                    onClose={handleReportClose}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: { minHeight: '80vh' }
                    }}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6">Credentialing Report</Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {reportData ? (reportData.provider_name || reportData.provider_id || reportData.meta?.provider_id || selectedProvider?.id || 'APP-1073') : 'APP-1073'}
                                </Typography>
                            </Box>
                            {reportData && (
                                <Button
                                    startIcon={<DownloadIcon />}
                                    onClick={downloadReport}
                                    variant="outlined"
                                    size="small"
                                >
                                    Download Report
                                </Button>
                            )}
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {reportLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Generating credentialing report...</Typography>
                            </Box>
                        )}

                        {reportError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {reportError}
                            </Alert>
                        )}

                        {reportData && reportData.report_content && (
                            <Box sx={{ pt: 2 }}>
                                <Paper sx={{ p: 3, maxHeight: '70vh', overflow: 'auto' }}>
                                    <ReactMarkdown
                                        components={{
                                            // Custom styling for markdown elements
                                            h1: ({ children }) => <Typography variant="h4" component="h1" gutterBottom sx={{ borderBottom: '2px solid #e0e0e0', pb: 1, mb: 2 }}>{children}</Typography>,
                                            h2: ({ children }) => <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3, mb: 2, color: 'primary.main' }}>{children}</Typography>,
                                            h3: ({ children }) => <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, mb: 1 }}>{children}</Typography>,
                                            p: ({ children }) => <Typography variant="body1" paragraph>{children}</Typography>,
                                            li: ({ children }) => <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>{children}</Typography>,
                                            table: ({ children }) => <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}><Table size="small">{children}</Table></TableContainer>,
                                            th: ({ children }) => <TableCell component="th" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>{children}</TableCell>,
                                            td: ({ children }) => <TableCell>{children}</TableCell>,
                                            code: ({ children }) => <Box component="code" sx={{ bgcolor: 'grey.100', p: 0.5, borderRadius: 1, fontFamily: 'monospace' }}>{children}</Box>,
                                            pre: ({ children }) => <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto', fontFamily: 'monospace' }}>{children}</Box>,
                                            blockquote: ({ children }) => <Box component="blockquote" sx={{ borderLeft: '4px solid #ccc', pl: 2, fontStyle: 'italic', color: 'text.secondary' }}>{children}</Box>
                                        }}
                                    >
                                        {reportData.report_content}
                                    </ReactMarkdown>
                                </Paper>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleReportClose}>Close</Button>
                        {reportData && reportData.report_content && (
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={downloadReport}
                            >
                                Download Report
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                {/* Provider Chat Sidebar */}
                <ProviderChatSidebar
                    open={chatOpen}
                    onClose={handleChatClose}
                    provider={chatProvider}
                />
            </Box>
            </CardContent>
        </Card>
    );
};

export default CommitteeReview;
