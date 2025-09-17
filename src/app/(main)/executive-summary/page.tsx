
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { kpiData, summaryTiles } from '@/lib/mock-data';
import { KpiCard } from '@/components/kpi-card';
import { StatusPieChart } from '@/components/charts/status-pie-chart';
import { TimeToCredentialBarChart } from '@/components/charts/time-to-credential-bar-chart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import mockDatabase from '@/components/committee-review/mockDatabase';
import { SpecialtyChart } from '@/components/charts/specialty-chart';
import { MarketDistributionChart } from '@/components/charts/market-distribution';
import { NetworkImpact } from '@/components/charts/network-impact';

export default function ExecutiveSummary() {
  const providers = mockDatabase.getProviders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState<{ id: string; name: string; status: string; market: string; }[]>([]);

  const handleViewClick = (title: string, items: { id: string; name: string; status: string; market: string; }[]) => {
    setModalTitle(title);
    setModalItems(items);
    setIsModalOpen(true);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Completed': return 'default';
        case 'Pending Review': return 'secondary';
        case 'Needs Further Review': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Executive Summary</h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Application Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="manual">Manual Entry</SelectItem>
              <SelectItem value="caqh">CAQH</SelectItem>
              <SelectItem value="email">Email Parsing</SelectItem>
              <SelectItem value="api">Availity API</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Object.entries(kpiData).map(([key, data]) => (
          <KpiCard
            key={key}
            title={data.label}
            value={data.value}
            change={data.change}
            description="vs. last month"
            trendData={data.trend}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <TimeToCredentialBarChart />
        </div>
        <div className="lg:col-span-3">
            <StatusPieChart />

        </div>

      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-6'>
        <div className="lg:col-span-2">
          <SpecialtyChart/>

        </div>
        <div className="lg:col-span-2">
            <MarketDistributionChart />

        </div>
        <div className="lg:col-span-2">
            <NetworkImpact />

        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight font-headline mb-4">Items Requiring Action</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryTiles.map((tile) => (
            <Card key={tile.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{tile.title}</CardTitle>
                <tile.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{tile.value}</div>
                <p className="text-xs text-muted-foreground">items require your attention</p>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full max-w-[120px]" onClick={() => handleViewClick(tile.title, tile.items)}>View List</Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogDescription>
                    List of items that require your immediate attention. Click an item to view details.
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>App ID</TableHead>
                        <TableHead>Provider Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Market</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {modalItems.map((item) => (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted" onClick={() => setIsModalOpen(false)}>
                            <TableCell>
                                <Link href={`/applications/review/${item.id}`} className="text-primary hover:underline">{item.id}</Link>
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                            <TableCell>{item.market}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
