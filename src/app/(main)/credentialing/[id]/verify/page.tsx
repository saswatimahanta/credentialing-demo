'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Confidence = 'High' | 'Medium' | 'Low';
type RowStatus = 'Pending' | 'Approved' | 'Rejected';

interface FieldRow {
    id: number;
    attribute: string;
    value: string;
    confidence: Confidence;
    evidence: boolean;
    comments: string;
    status: RowStatus;
}

// Placeholder initial extracted fields (normally returned by backend)
const initialRows: FieldRow[] = [
    { id: 1, attribute: 'University / Issuer', value: 'University of California', confidence: 'High', evidence: true, comments: '', status: 'Pending' },
    { id: 2, attribute: 'Campus', value: 'Irvine', confidence: 'High', evidence: true, comments: '', status: 'Pending' },
    { id: 3, attribute: 'Recipient Name', value: 'Mark Steven Shirey Shriau', confidence: 'High', evidence: true, comments: '', status: 'Pending' },
    { id: 4, attribute: 'Degree', value: 'Doctor of Philosophy', confidence: 'High', evidence: true, comments: '', status: 'Pending' },
    { id: 5, attribute: 'Field of Study', value: 'Engineering', confidence: 'High', evidence: true, comments: '', status: 'Pending' },
    { id: 6, attribute: 'Date of Conferral', value: 'June 17, 1989', confidence: 'Medium', evidence: true, comments: '', status: 'Pending' },
    { id: 7, attribute: 'Signatories', value: 'George Deukmejian, David P. C', confidence: 'Medium', evidence: true, comments: '', status: 'Pending' },
    { id: 8, attribute: 'Seal Detected', value: 'University of California Seal', confidence: 'Medium', evidence: true, comments: '', status: 'Pending' },
    { id: 9, attribute: 'Document Type', value: 'Degree Certificate', confidence: 'High', evidence: true, comments: '', status: 'Pending' },
];

const confidenceBadgeStyles: Record<Confidence, string> = {
    High: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-red-100 text-red-700 border-red-200'
};

const statusBadgeVariant = (status: RowStatus) => {
    switch (status) {
        case 'Approved': return 'default' as const;
        case 'Rejected': return 'destructive' as const;
        default: return 'secondary' as const;
    }
};

export default function VerifyExtractedDataPage({ params }: { params: { id: string } }) {
    const [rows, setRows] = useState<FieldRow[]>(initialRows);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    const allSelected = selectedIds.length === rows.length && rows.length > 0;
    const partiallySelected = selectedIds.length > 0 && selectedIds.length < rows.length;

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]); else setSelectedIds(rows.map(r => r.id));
    };

    const toggleRow = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const approveSelected = () => {
        if (selectedIds.length === 0) {
            toast({ title: 'No rows selected', description: 'Select at least one field to approve.' });
            return;
        }
        setRows(curr => curr.map(r => selectedIds.includes(r.id) ? { ...r, status: 'Approved' } : r));
        toast({ title: 'Approved', description: `${selectedIds.length} field(s) approved.` });
        setSelectedIds([]);
    };

    const rejectSelected = () => {
        if (selectedIds.length === 0) {
            toast({ title: 'No rows selected', description: 'Select at least one field to reject.' });
            return;
        }
        setRows(curr => curr.map(r => selectedIds.includes(r.id) ? { ...r, status: 'Rejected' } : r));
        toast({ title: 'Rejected', description: `${selectedIds.length} field(s) marked rejected.` });
        setSelectedIds([]);
    };

    return (
        <div className='space-y-6'>
            <Button asChild variant='ghost' className='mb-2 px-0'>
                <Link href={`/credentialing/${params.id}`}><ArrowLeft className='h-4 w-4 mr-2' />Back</Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Provider Details</CardTitle>
                    <CardDescription>Healthcare Provider Information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-wrap gap-8 text-sm'>
                        <div>
                            <p className='text-muted-foreground'>Provider Name</p>
                            <p className='font-medium'>Mark Steven Shirey Shriau</p>
                        </div>
                        <div>
                            <p className='text-muted-foreground'>NPI</p>
                            <p className='font-medium'>8761455663</p>
                        </div>
                        <div>
                            <p className='text-muted-foreground'>Documents</p>
                            <p className='font-medium'>4</p>
                        </div>
                        <div>
                            <p className='text-muted-foreground'>Health Score</p>
                            <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>93.33%</Badge>
                        </div>
                        <div>
                            <p className='text-muted-foreground'>Last Update</p>
                            <p className='font-medium'>01/01/2025</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-start justify-between space-y-0'>
                    <div>
                        <CardTitle>Certificate Data Extraction</CardTitle>
                        <CardDescription>Review and approve extracted attributes from the uploaded credential.</CardDescription>
                    </div>
                    <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={rejectSelected} disabled={selectedIds.length === 0}>Reject</Button>
                        <Button size='sm' onClick={approveSelected} disabled={selectedIds.length === 0}>Approve</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[30px]'>
                                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-checked={partiallySelected ? 'mixed' : allSelected} />
                                </TableHead>
                                <TableHead className='w-[40px]'>No.</TableHead>
                                <TableHead>Attribute</TableHead>
                                <TableHead>Extracted Value</TableHead>
                                <TableHead>Confidence</TableHead>
                                <TableHead>Evidence</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, idx) => (
                                <TableRow key={row.id} data-state={selectedIds.includes(row.id) ? 'selected' : undefined}>
                                    <TableCell>
                                        <Checkbox checked={selectedIds.includes(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                                    </TableCell>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell className='font-medium'>{row.attribute}</TableCell>
                                    <TableCell>
                                        <input
                                            className='w-full bg-transparent border rounded-md px-2 py-1 text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary'
                                            value={row.value}
                                            onChange={e => setRows(curr => curr.map(r => r.id === row.id ? { ...r, value: e.target.value } : r))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant='outline' className={confidenceBadgeStyles[row.confidence]}>{row.confidence}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {row.evidence ? <Eye className='h-4 w-4 text-primary cursor-pointer' /> : '-'}
                                    </TableCell>
                                    <TableCell className='text-xs text-muted-foreground'>{row.comments || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Separator className='my-4' />
                    <p className='text-xs text-muted-foreground'>{selectedIds.length} of {rows.length} items selected</p>
                </CardContent>
            </Card>
        </div>
    );
}