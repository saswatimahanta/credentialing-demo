
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, History } from "lucide-react";
import mockApi from "@/lib/mock-data";


const reportFields = [
    "Provider Info", "Application Details", "Documents Uploaded", "Credentialing Status", "Verification Log", "Communication Log"
];

export default async function ReportsPage() {
  const recentReports = await mockApi.getRecentReports();

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Reports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Customize and export credentialing data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Input type="date" />
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-status">Credentialing Status</Label>
                <Select>
                  <SelectTrigger id="c-status"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="market">Market</Label>
                <Select>
                  <SelectTrigger id="market"><SelectValue placeholder="All Markets" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Markets</SelectItem>
                    <SelectItem value="ca">California</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select>
                  <SelectTrigger id="source"><SelectValue placeholder="All Sources" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                    <SelectItem value="caqh">CAQH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
                <Label className="mb-2 block">Report Fields (for Provider Roster)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {reportFields.map(field => (
                        <div key={field} className="flex items-center space-x-2">
                            <Checkbox id={field.toLowerCase().replace(' ', '-')}/>
                            <label htmlFor={field.toLowerCase().replace(' ', '-')} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {field}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
              <Button><FileDown className="mr-2 h-4 w-4" /> Export Credentialing Report (PDF)</Button>
              <Button><FileDown className="mr-2 h-4 w-4" /> Export Provider Roster (Excel)</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Recent Report History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentReports.map(report => (
                        <TableRow key={report.name}>
                            <TableCell className="font-medium">{report.name}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>{report.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
