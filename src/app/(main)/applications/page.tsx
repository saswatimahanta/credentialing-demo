"use client"

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileUp, ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react';
import ApplicationIntake from '@/components/custom/ApplicationIntake';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import axios from 'axios';
// Removed sheet-based filter UI; using inline filters panel
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const statusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const s = (status || '').trim().toLowerCase();
    switch (s) {
        case 'completed':
            return 'default';
        case 'pending review':
            return 'secondary';
        case 'needs further review':
            return 'destructive';
        case 'sanctioned':
            return 'destructive';
        case 'in_progress':
        case 'in progress':
        case 'closed':
            return 'outline';
        default:
            return s.includes('sanction') ? 'destructive' : 'outline';
    }
}

export default function ApplicationsPage() {
    const router = useRouter();
    interface AppItem {
        id: string;
        providerId?: string;
        name: string;
        psvStatus: string;
        progress: number;
        assignee?: string;
        source?: string;
        market?: string;
    }
    const [applications, setApplications] = useState<AppItem[]>([]);
    const [showIntakeModal, setShowIntakeModal] = useState(false);
    const [rosterCompleted, setRosterCompleted] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({
        providerId: '',
        name: '',
        status: 'all',
        market: 'all',
        source: 'all',
        assignee: '',
        progressMin: '',
        progressMax: ''
    });
    const [sortBy, setSortBy] = useState<keyof AppItem | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

    const loadApplications = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/applications`);
            console.log('this', response.data)
            let data: AppItem[] = response.data;
            // Hide APP-1073 until roster intake completed
            if (!rosterCompleted) {
                data = data.filter(a => a.id !== 'APP-1073');
            }
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        }
    };

    useEffect(() => {
        loadApplications();
    }, [rosterCompleted]);

    const handleIntakeModalChange = (open: boolean) => {
        setShowIntakeModal(open);
        if (!open) {
            // Modal just closed: refresh the applications list
            loadApplications();
        }
    };

    const handleRowClick = (appId: string) => {
        router.push(`/applications/${appId}`);
    };

    const unique = (list: Array<string | undefined>) => Array.from(new Set(list.filter(Boolean) as string[]));
    const statusOptions = unique(applications.map(a => a.psvStatus));
    const marketOptions = unique(applications.map(a => a.market));
    const sourceOptions = unique(applications.map(a => a.source));

    const applyFilters = (rows: AppItem[]) => rows.filter(r => {
        if (filters.providerId && !(r.providerId || '').toLowerCase().includes(filters.providerId.toLowerCase())) return false;
        if (filters.name && !r.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.status !== 'all' && r.psvStatus !== filters.status) return false;
        if (filters.market !== 'all' && r.market !== filters.market) return false;
        if (filters.source !== 'all' && r.source !== filters.source) return false;
        if (filters.assignee && !(r.assignee || '').toLowerCase().includes(filters.assignee.toLowerCase())) return false;
        const min = filters.progressMin ? Number(filters.progressMin) : null;
        const max = filters.progressMax ? Number(filters.progressMax) : null;
        if (min !== null && r.progress < min) return false;
        if (max !== null && r.progress > max) return false;
        return true;
    });

    const applySort = (rows: AppItem[]) => {
        if (!sortBy || !sortDir) return rows;
        const sorted = [...rows].sort((a, b) => {
            const av = a[sortBy];
            const bv = b[sortBy];
            if (typeof av === 'number' && typeof bv === 'number') return av - bv;
            return String(av ?? '').localeCompare(String(bv ?? ''), undefined, { sensitivity: 'base' });
        });
        return sortDir === 'asc' ? sorted : sorted.reverse();
    };

    const displayedApps = applySort(applyFilters(applications));

    const toggleSort = (key: keyof AppItem) => {
        if (sortBy !== key) { setSortBy(key); setSortDir('asc'); return; }
        setSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
        if (sortDir === null) setSortBy(null);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-normal">Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{applications.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-normal">Pending Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{applications.filter(a => a.status === 'Pending Review').length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-normal">Closed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{applications.filter(a => a.status === 'Closed').length}</p>
                    </CardContent>
                </Card>
                {/* Add Button */}

                <div className="flex items-center justify-center">
                    <Button
                        onClick={() => setShowIntakeModal(true)}
                        className="h-10 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        + Add New
                    </Button>
                </div>
            </div>

            <Dialog open={showIntakeModal} onOpenChange={handleIntakeModalChange}>
                <DialogContent className="max-w-6xl h-[75vh] overflow-y-auto p-10">
                    <VisuallyHidden>
                        <DialogTitle>Hidden but accessible title</DialogTitle>
                    </VisuallyHidden>
                    <ApplicationIntake onRosterIntakeComplete={() => { setRosterCompleted(true); }} />
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <div>
                        <CardTitle>Applications</CardTitle>
                        <CardDescription>Manage and review provider applications.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {!showFilters && <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => { setFilters({ providerId: '', name: '', status: 'all', market: 'all', source: 'all', assignee: '', progressMin: '', progressMax: '' }); }}>
                            {/* <ListFilter className="h-3.5 w-3.5" /> */}
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Clear Filters</span>
                        </Button>}
                        <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => setShowFilters(v => !v)}>
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filters</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { router.push(`/applications/reports`) }} className="h-7 gap-1">
                            <FileUp className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {showFilters && (
                        <div className="mb-4 rounded-md border p-4 bg-muted/20">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <Label htmlFor="f-provider">Provider ID</Label>
                                    <Input id="f-provider" value={filters.providerId} onChange={(e) => setFilters({ ...filters, providerId: e.target.value })} placeholder="e.g., 1001" />
                                </div>
                                <div>
                                    <Label htmlFor="f-name">Name</Label>
                                    <Input id="f-name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="Search name" />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                                        <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {statusOptions.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Market</Label>
                                    <Select value={filters.market} onValueChange={(v) => setFilters({ ...filters, market: v })}>
                                        <SelectTrigger><SelectValue placeholder="All Markets" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {marketOptions.map(m => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Source</Label>
                                    <Select value={filters.source} onValueChange={(v) => setFilters({ ...filters, source: v })}>
                                        <SelectTrigger><SelectValue placeholder="All Sources" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {sourceOptions.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="f-assignee">Assignee</Label>
                                    <Input id="f-assignee" value={filters.assignee} onChange={(e) => setFilters({ ...filters, assignee: e.target.value })} placeholder="Type a name" />
                                </div>
                                <div>
                                    <Label htmlFor="f-min">Progress min</Label>
                                    <Input id="f-min" type="number" min={0} max={100} value={filters.progressMin} onChange={(e) => setFilters({ ...filters, progressMin: e.target.value })} />
                                </div>
                                <div>
                                    <Label htmlFor="f-max">Progress max</Label>
                                    <Input id="f-max" type="number" min={0} max={100} value={filters.progressMax} onChange={(e) => setFilters({ ...filters, progressMax: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => { setFilters({ providerId: '', name: '', status: 'all', market: 'all', source: 'all', assignee: '', progressMin: '', progressMax: '' }); }}>Clear</Button>
                                <Button onClick={() => setShowFilters(false)}>Apply</Button>
                            </div>
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => toggleSort('providerId')} className="cursor-pointer">Provider ID</TableHead>
                                <TableHead onClick={() => toggleSort('name')} className="cursor-pointer">Name</TableHead>
                                <TableHead onClick={() => toggleSort('psvStatus')} className="cursor-pointer">Status</TableHead>
                                <TableHead onClick={() => toggleSort('progress')} className="cursor-pointer">% Complete</TableHead>
                                <TableHead onClick={() => toggleSort('assignee')} className="cursor-pointer">Assignee</TableHead>
                                <TableHead onClick={() => toggleSort('source')} className="cursor-pointer">Source</TableHead>
                                <TableHead onClick={() => toggleSort('market')} className="cursor-pointer">Market</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedApps.map((app) => (
                                <TableRow key={app.id} onClick={() => handleRowClick(app.id)} className="cursor-pointer">
                                    <TableCell className="font-medium">{app.providerId}</TableCell>
                                    <TableCell>{app.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant(app.psvStatus)}>{app.psvStatus}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{app.progress}%</span>
                                            <Progress value={app.progress} className="w-[100px]" />
                                        </div>
                                    </TableCell>
                                    <TableCell>{app.assignee}</TableCell>
                                    <TableCell>{app.source}</TableCell>
                                    <TableCell>{app.market}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleRowClick(app.id)}>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Assign Analyst</DropdownMenuItem>
                                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/credentialing/${app.id}`) }}>
                                                    Proceed to Credentialing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Mark for Review</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}
