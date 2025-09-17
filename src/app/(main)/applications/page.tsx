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


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const statusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Needs Further Review': return 'destructive';
        case 'In-Progress':
        case 'Closed':
        default: return 'outline';
    }
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  
  useEffect(() => {
    async function loadData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/applications`);
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    }
  
    loadData();
  }, []);

  const handleRowClick = (appId: string) => {
    router.push(`/applications/${appId}`);
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

        <Dialog open={showIntakeModal} onOpenChange={setShowIntakeModal}>
            <DialogContent className="max-w-6xl h-[75vh] overflow-y-auto p-10">
            <VisuallyHidden>
                <DialogTitle>Hidden but accessible title</DialogTitle>
            </VisuallyHidden>
                <ApplicationIntake />
            </DialogContent>
        </Dialog>

        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>Manage and review provider applications.</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 gap-1">
                        <FileUp className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>App ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>% Complete</TableHead>
                            <TableHead>Assignee</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Market</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id} onClick={() => handleRowClick(app.id)} className="cursor-pointer">
                                <TableCell className="font-medium">{app.id}</TableCell>
                                <TableCell>{app.name}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
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
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/credentialing/${app.id}`)}}>
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
