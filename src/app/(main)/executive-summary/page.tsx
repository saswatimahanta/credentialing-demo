
'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { summaryTiles } from '@/lib/mock-data';
import { KpiCard } from '@/components/kpi-card';
import { StatusPieChart } from '@/components/charts/status-pie-chart';
import { TimeToCredentialBarChart } from '@/components/charts/time-to-credential-bar-chart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SpecialtyChart } from '@/components/charts/specialty-chart';
import { MarketDistributionChart } from '@/components/charts/market-distribution';
import { NetworkImpact } from '@/components/charts/network-impact';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ExecutiveSummary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState<{ id: string; name: string; status: string; market: string; }[]>([]);
  type TrendPoint = { month: string; value: number };
  type KpiEntry = { value: number; change: string; label: string; trend: TrendPoint[] };
  type KpiMap = Record<string, KpiEntry>;
  type BarPoint = { month: string; avgTime: number };
  type SpecialtyPoint = { status: string; count: number; percentage: number };
  type ImpactPoint = { impact: string; count: number; percent: number; color: string };

  const [kpiData, setKpiData] = useState<KpiMap>({} as KpiMap)
  const [timeToCredentialData, setTimeToCredentialData] = useState<BarPoint[]>([])
  const [specialtyData, setSpecialtyData] = useState<SpecialtyPoint[]>([])
  const [marketValue, setMarketValue] = useState('ca')
  const [networkImpactData, setNetworkImpactData] = useState<ImpactPoint[]>([])
  const [distributionData, setDistributionData] = useState([])
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
  useEffect(() => {
    async function loadData() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/executive-summary`);
        const kpi = {
          totalApplications: { value: response?.data?.totalApplications, change: response?.data?.totalApplications ? '+15.2%' : '', label: 'Total Applications', trend: [{ month: 'Jan', value: 100 }, { month: 'Feb', value: 120 }, { month: 'Mar', value: 150 }, { month: 'Apr', value: 130 }, { month: 'May', value: 180 }, { month: 'Jun', value: 200 }] },
          completed: { value: response?.data?.completed, change: response?.data?.completed > 0 ? '+10.1%' : '', label: 'Completed', trend: [{ month: 'Jan', value: 70 }, { month: 'Feb', value: 80 }, { month: 'Mar', value: 90 }, { month: 'Apr', value: 85 }, { month: 'May', value: 100 }, { month: 'Jun', value: 110 }] },
          inProgress: { value: response?.data?.inProgress, change: response?.data?.inProgress > 0 ? '+5.5%' : '', label: 'In-Progress', trend: [{ month: 'Jan', value: 20 }, { month: 'Feb', value: 25 }, { month: 'Mar', value: 30 }, { month: 'Apr', value: 28 }, { month: 'May', value: 40 }, { month: 'Jun', value: 45 }] },
          notStarted: { value: response?.data?.notStarted, change: response?.data?.notStarted > 0 ? '-2.0%' : '', label: 'Not Started', trend: [{ month: 'Jan', value: 10 }, { month: 'Feb', value: 12 }, { month: 'Mar', value: 15 }, { month: 'Apr', value: 13 }, { month: 'May', value: 20 }, { month: 'Jun', value: 25 }] },
          needsReview: { value: response?.data?.needsFurtherReview, change: '', label: 'Needs Further Review', trend: [{ month: 'Jan', value: 1 }, { month: 'Feb', value: 2 }, { month: 'Mar', value: 4 }, { month: 'Apr', value: 3 }, { month: 'May', value: 5 }, { month: 'Jun', value: 6 }] },
        }
        setKpiData(kpi)

        const barChartData = response?.data?.avgTimeToCredential.map((row: { month: string; days: number }) => {
          return {
            month: row.month,
            avgTime: Math.floor(row.days/6),
          }
        })
        setTimeToCredentialData(barChartData)

        const specialtyChartData = response?.data?.topSpecialities.map((row: { specialty: string; count: number; percent: number }) => {
          return {
            status: row.specialty,
            count: row.count,
            percentage: row.percent,
          }
        })
        setSpecialtyData(specialtyChartData)

        const total = response?.data?.totalApplications
        const impactChartData = [
          { impact: 'High', count: response?.data?.highImpact, percent: (response?.data?.highImpact / total) * 100, color: '#f44336' },
          { impact: 'Medium', count: response?.data?.mediumImpact, percent: (response?.data?.mediumImpact / total) * 100, color: '#ff9800' },
          { impact: 'Low', count: response?.data?.lowImpact, percent: (response?.data?.lowImpact / total) * 100, color: '#4caf50' }
        ]
        setNetworkImpactData(impactChartData)

        const donutChartData = [
          { name: 'In Progress', value: response?.data?.inProgress },
          { name: 'Committee Review', value: response?.data?.committeeReview },
          { name: 'Approved', value: response?.data?.approved },
          { name: 'Initiated', value: 38 },
          { name: 'Denied', value: response?.data?.denied },
        ]
        setDistributionData(donutChartData)
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    }

    loadData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Executive Summary</h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select defaultValue="ca" onValueChange={(e) => { setMarketValue(e) }}>
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
            value={String(data.value)}
            change={data.change}
            description={data.value > 0 ? "vs. last month" : ''}
            trendData={data.trend}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <TimeToCredentialBarChart barChartData={timeToCredentialData} />
        </div>
        <div className="lg:col-span-3">
          <StatusPieChart data={distributionData} />

        </div>

      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-6'>
        <div className={marketValue === 'ca' ? 'lg:col-span-4' : ' lg:col-span-2'}>
          <SpecialtyChart data={specialtyData} market={marketValue} />

        </div>
        {marketValue !== 'ca' && <div className="lg:col-span-2">
          <MarketDistributionChart />
        </div>}
        <div className="lg:col-span-2">
          <NetworkImpact distribution={networkImpactData} />

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
