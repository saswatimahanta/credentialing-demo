'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CredentialingPage() {
  const [applications, setApplications] = useState([]);
  const [credentialingApps, setCredentialingApps] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/applications`);
        setApplications(response.data);

        const tempCredentialingApps = response.data.filter(app => ['New', 'AI Read Complete', 'AI Read in Progress', 'IN_PROGRESS', 'Needs Further Review', 'COMPLETED', 'Pending Review'].includes(app.psvStatus));
        setCredentialingApps(tempCredentialingApps);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    }

    loadData();
  }, []);

  const getStatusCounts = (apps: Application[]) => {
    return apps.reduce((acc, app) => {
        if (app.status === 'Completed') acc.approved++;
        else if (app.status === 'Closed') acc.rejected++; // Assuming Closed means Rejected for this view
        else if (['New', 'AI Read Complete', 'AI Read in Progress', 'In-Progress'].includes(app.status)) acc.inProgress++;
        else if (app.status === 'Pending Review' || app.status === 'Needs Further Review') acc.pendingReview++;
        return acc;
    }, { total: apps.length, approved: 0, rejected: 0, inProgress: 0, pendingReview: 0 });
  };

  const counts = getStatusCounts(credentialingApps);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight font-headline">Credentialing</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.rejected}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">In-Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.pendingReview}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credentialing Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>App ID</TableHead>
                <TableHead>Credentialing Status</TableHead>
                <TableHead><span className="sr-only">Action</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentialingApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.providerId}</TableCell>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.id}</TableCell>
                  <TableCell><Badge variant={statusVariant(app.psvStatus)}>{app.psvStatus}</Badge></TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/credentialing/${app.id}`}>View Workflow</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
