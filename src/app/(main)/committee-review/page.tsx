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
import mockDatabase from '@/components/committee-review/mockDatabase';
import api from '@/lib/mock-data';
import ProviderDetailsDialog from '@/components/committee-review/provider-details-dialog';
import ChecklistManager from '@/components/committee-review/checklist-manager';
import ProviderChatSidebar from '@/components/committee-review/provider-chat-sidebar';
import { Card,CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

const CommitteeReview = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
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
    const [filters, setFilters] = useState({
        specialty: "",
        market: "",
        status: "",
        analyst: "",
        networkImpact: "",
    });
    const [selected, setSelected] = useState<number[]>([]);

    const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredProviders = providers.filter((p: any) =>
        (filters.specialty === "" || p.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) &&
        (filters.market === "" || p.market.toLowerCase().includes(filters.market.toLowerCase())) &&
        (filters.status === "" || p.status.toLowerCase().includes(filters.status.toLowerCase())) &&
        (filters.analyst === "" || p.assignedAnalyst.toLowerCase().includes(filters.analyst.toLowerCase())) &&
        (filters.networkImpact === "" || p.networkImpact.toLowerCase().includes(filters.networkImpact.toLowerCase()))
    );


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
        setAnchorEl(event.currentTarget);
        setMenuProvider(provider);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuProvider(null);
    };

    const handleViewDetails = (provider: any) => {
        setSelectedProvider(provider);
        setDetailsDialogOpen(true);
        handleMenuClose();
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
                        <div className='flex justify-center items-center'>
                            <FormControl sx={{ m: 1, minWidth: 150}} size="small">
                                <InputLabel id="demo-select-small-label">Organization</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={organization}
                                    label="Organization"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                    <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Org 1</MenuItem>
                                    <MenuItem value={20}>Org 2</MenuItem>
                                    <MenuItem value={30}>Org 3</MenuItem>
                                </Select>
                            </FormControl>
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
            <Box>

                {/* Providers Table */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={
                                            selected.some(id => filteredProviders.some(p => p.id === id)) &&
                                            selected.length < filteredProviders.length
                                        }
                                        checked={
                                            filteredProviders.length > 0 &&
                                            filteredProviders.every(p => selected.includes(p.id))
                                        }
                                        onChange={handleSelectAll}
                                    />

                                    </TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Specialty</TableCell>
                                    <TableCell>Market</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assigned Analyst</TableCell>
                                    <TableCell>Submission Date</TableCell>
                                    <TableCell>Network Impact</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>

                                {/* 🔽 Filter Row */}
                                <TableRow>
                                    <TableCell /> {/* Empty for checkbox column */}
                                    <TableCell /> {/* Provider column - no filter */}
                                    <TableCell>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="Filter"
                                        value={filters.specialty}
                                        onChange={(e) => handleFilterChange("specialty", e.target.value)}
                                    />
                                    </TableCell>
                                    <TableCell>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="Filter"
                                        value={filters.market}
                                        onChange={(e) => handleFilterChange("market", e.target.value)}
                                    />
                                    </TableCell>
                                    <TableCell>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="Filter"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange("status", e.target.value)}
                                    />
                                    </TableCell>
                                    <TableCell>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="Filter"
                                        value={filters.analyst}
                                        onChange={(e) => handleFilterChange("analyst", e.target.value)}
                                    />
                                    </TableCell>
                                    <TableCell /> {/* Submission Date - leave out filter for now */}
                                    <TableCell>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="Filter"
                                        value={filters.networkImpact}
                                        onChange={(e) => handleFilterChange("networkImpact", e.target.value)}
                                    />
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredProviders.map((provider: any) => {
                                    const isChecked = selected.includes(provider.id);

                                    return (
                                    <TableRow key={provider.id} hover>
                                        <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={() => handleCheckboxClick(provider.id)}
                                        />
                                        </TableCell>
                                        <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                                                {provider.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ID: {provider.id}
                                            </Typography>
                                            </Box>
                                        </Box>
                                        </TableCell>
                                        <TableCell>{provider.specialty}</TableCell>
                                        <TableCell>{provider.market}</TableCell>
                                        <TableCell>
                                        <Chip
                                            label={provider.status}
                                            color={getStatusColor(provider.status)}
                                            size="small"
                                        />
                                        </TableCell>
                                        <TableCell>{provider.assignedAnalyst}</TableCell>
                                        <TableCell>{provider.submissionDate}</TableCell>
                                        <TableCell>
                                        <Chip
                                            label={provider.networkImpact}
                                            color={
                                            provider.networkImpact === "High"
                                                ? "error"
                                                : provider.networkImpact === "Medium"
                                                ? "warning"
                                                : "success"
                                            }
                                            variant="outlined"
                                            size="small"
                                        />
                                        </TableCell>
                                        <TableCell align="center">
                                        <IconButton
                                            onClick={(e: any) => handleMenuOpen(e, provider)}
                                            size="small"
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                                </TableBody>

                        </Table>
                    </TableContainer>
                </Paper>

                {/* Action Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => handleViewDetails(menuProvider)}>
                        View Details
                    </MenuItem>
                    <MenuItem onClick={() => handleViewChecklist(menuProvider)}>
                        View Checklist
                    </MenuItem>
                    <MenuItem onClick={() => handleGenerateReport(menuProvider)}>
                        Generate Report
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenChat(menuProvider)}>
                        Chat with AI
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleStartApproval(menuProvider)}>
                        Approve/Deny
                    </MenuItem>
                </Menu>

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
                            </FormControl>

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
