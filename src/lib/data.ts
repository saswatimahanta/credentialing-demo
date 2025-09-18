import { FileText, Mail, Phone, Calendar, Clock, BarChart2, PieChart, Users, FileWarning, FolderClock, HandPlatter, Building, Package } from 'lucide-react';
import { CommitteeReviewIcon } from '@/components/icons/committee-review';

export const kpiData = {
  totalApplications: { value: '1,250', change: '+15.2%', label: 'Total Applications', trend: [{ month: 'Jan', value: 100 }, { month: 'Feb', value: 120 }, { month: 'Mar', value: 150 }, { month: 'Apr', value: 130 }] },
  completed: { value: '890', change: '+10.1%', label: 'Completed', trend: [{ month: 'Jan', value: 70 }, { month: 'Feb', value: 80 }, { month: 'Mar', value: 90 }, { month: 'Apr', value: 85 }] },
  inProgress: { value: '250', change: '+5.5%', label: 'In-Progress', trend: [{ month: 'Jan', value: 20 }, { month: 'Feb', value: 25 }, { month: 'Mar', value: 30 }, { month: 'Apr', value: 28 }] },
  notStarted: { value: '95', change: '-2.0%', label: 'Not Started', trend: [{ month: 'Jan', value: 10 }, { month: 'Feb', value: 12 }, { month: 'Mar', value: 15 }, { month: 'Apr', value: 13 }] },
  needsReview: { value: '15', change: '+25%', label: 'Needs Further Review', trend: [{ month: 'Jan', value: 1 }, { month: 'Feb', value: 2 }, { month: 'Mar', value: 4 }, { month: 'Apr', value: 3 }] },
};

export const donutChartData = [
  { name: 'Approved', value: 890 },
  { name: 'Rejected', value: 110 },
  { name: 'Pending Review', value: 250 },
  { name: 'In-Progress', value: 95 },
];
export const donutChartConfig = {
  approved: { label: 'Approved', color: 'hsl(var(--chart-2))' },
  rejected: { label: 'Rejected', color: 'hsl(var(--chart-1))' },
  'pending review': { label: 'Pending Review', color: 'hsl(var(--chart-4))' },
  'in-progress': { label: 'In-Progress', color: 'hsl(var(--chart-5))' },
};

export const barChartData = [
  { application: 'Manual Entry', days: 20 },
  { application: 'CAQH ProView', days: 18 },
  { application: 'Email Parsing', days: 15 },
  { application: 'Availity API', days: 12 },
];

export const summaryTiles = [
  { title: 'Providers Awaiting Action', value: '78', icon: Users, items: ['Dr. John Smith', 'Dr. Emily White'] },
  { title: 'Payers Awaiting Action', value: '32', icon: HandPlatter, items: ['Aetna', 'Cigna'] },
  { title: 'Verification Centres Awaiting Action', value: '12', icon: Building, items: ['CA Medical Board', 'NY State Education Dept'] },
  { title: 'Follow-up / Reminder Pending', value: '45', icon: Mail, items: ['Follow up with Dr. Michael Brown', 'Reminder to TX DMV'] },
];

export const navLinks = [
  { href: '/executive-summary', label: 'Executive Summary', icon: PieChart },
  { href: '/applications', label: 'Applications', icon: FileText },
  { href: '/credentialing', label: 'Credentialing', icon: Package },
  { href: '/verification-centres', label: 'Verification Centres', icon: Users },
  { href: '/communication', label: 'Communication', icon: Mail },
  { href: '/committee-review', label: 'Committee Review', icon: CommitteeReviewIcon },
];

export const communicationTabs = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'call', label: 'Call', icon: Phone },
  { value: 'meeting', label: 'Meeting', icon: Calendar },
  { value: 'reminders', label: 'Reminders', icon: Clock },
];
