
import { Users, HandPlatter, Building, Mail } from 'lucide-react';

export interface Application {
    id: string;
    providerId: string;
    name: string;
    status: 'Completed' | 'Pending Review' | 'In-Progress' | 'Closed' | 'Needs Further Review';
    progress: number;
    assignee: string;
    source: 'Manual Entry' | 'CAQH Integration' | 'Email Parsing' | 'Availity API';
    market: string;
    specialty: string;
    address: string;
    npi: string;
}

export interface AiIssue {
    field: string;
    issue: string;
    confidence: number;
    value: string;
    reasoning: string;
}

export interface TimelineEvent {
    by: string;
    comment: string;
    time: string;
    type: 'SYSTEM' | 'USER' | 'AI' | 'COMMENT';
}

export interface DocumentStatus {
    fileType: string;
    status: 'New' | 'Verified' | 'Pending' | 'Flagged';
    progress: number;
    ocrData?: {
        type: string;
        number: string;
        issueDate: string;
        expiryDate: string;
        confidence: {
            type: number;
            number: number;
            issueDate: number;
            expiryDate: number;
        }
    }
}

export interface VerificationCentre {
    name: string;
    state: string;
    address: string;
    email: string;
    type: string;
}

export interface Email {
    id: number;
    from: string;
    subject: string;
    date: string;
    unread: boolean;
    to?: string;
    body?: string;
    thread?: { from: string; body: string }[];
}


export interface Report {
    name: string;
    date: string;
    type: 'PDF' | 'Excel';
}

const applications: Application[] = [
    { id: 'APP-002', providerId: 'P54321', name: 'Dr. Emily White', status: 'In-Progress', progress: 75, assignee: 'Bob Williams', source: 'CAQH Integration', market: 'California', specialty: 'Dermatology', address: '456 Skin Ave, Suite 200, Beverly Hills, CA, 90210', npi: '0987654321' },
    { id: 'APP-003', providerId: 'P67890', name: 'Dr. Michael Brown', status: 'In-Progress', progress: 50, assignee: 'Charlie Davis', source: 'Email Parsing', market: 'New York', specialty: 'Neurology', address: '789 Brain Blvd, Thinktown, NY, 10001', npi: '1122334455' },
    { id: 'APP-004', providerId: 'P11223', name: 'Dr. Sarah Miller', status: 'Closed', progress: 100, assignee: 'Alice Johnson', source: 'Availity API', market: 'Texas', specialty: 'Pediatrics', address: '101 Child Way, Kidston, TX, 75001', npi: '6677889900' },
    { id: 'APP-005', providerId: 'P44556', name: 'Dr. David Wilson', status: 'Needs Further Review', progress: 90, assignee: 'Unassigned', source: 'Manual Entry', market: 'Florida', specialty: 'Orthopedics', address: '202 Bone Ln, Jointsville, FL, 33101', npi: '1231231234' },
    { id: 'APP-006', providerId: 'P77889', name: 'Dr. Jessica Garcia', status: 'Completed', progress: 100, assignee: 'Bob Williams', source: 'CAQH Integration', market: 'National', specialty: 'Oncology', address: '303 Hope Dr, Cure City, WA, 98101', npi: '4564564567' },
    { id: 'APP-007', providerId: 'P99999', name: 'Dr. Robert King', status: 'Pending Review', progress: 10, assignee: 'Unassigned', source: 'Manual Entry', market: 'California', specialty: 'Cardiology', address: '1 Heart Way, Loveland, CA, 90210', npi: '9998887776' },
    { id: 'APP-008', providerId: 'P88888', name: 'Dr. Linda Martinez', status: 'Pending Review', progress: 10, assignee: 'Unassigned', source: 'Manual Entry', market: 'New York', specialty: 'Neurology', address: '2 Nerve St, Big Apple, NY, 10001', npi: '8887776665' },
    { id: 'APP-009', providerId: 'P10101', name: 'Dr. Kevin Lee', status: 'In-Progress', progress: 60, assignee: 'Charlie Davis', source: 'Manual Entry', market: 'California', specialty: 'Dermatology', address: '101 Skin Ave, Beverly Hills, CA, 90210', npi: '1010101010' },
    { id: 'APP-010', providerId: 'P20202', name: 'Dr. Karen Hall', status: 'Pending Review', progress: 20, assignee: 'Unassigned', source: 'Manual Entry', market: 'Texas', specialty: 'Pediatrics', address: '202 Child Way, Kidston, TX, 75001', npi: '2020202020' },
    { id: 'APP-011', providerId: 'P30303', name: 'Dr. Steven Young', status: 'In-Progress', progress: 80, assignee: 'Bob Williams', source: 'CAQH Integration', market: 'Florida', specialty: 'Orthopedics', address: '303 Bone Ln, Jointsville, FL, 33101', npi: '3030303030' },
    { id: 'APP-012', providerId: 'P40404', name: 'Dr. James Lee', status: 'Needs Further Review', progress: 95, assignee: 'Alice Johnson', source: 'Email Parsing', market: 'New York', specialty: 'Cardiology', address: '404 Heart Way, Loveland, NY, 10001', npi: '4040404040' },
];

const aiIssues: Record<string, AiIssue[]> = {
    'APP-002': [
        { field: 'Address', issue: 'ZIP code mismatch with state.', confidence: 0.95, value: '90210', reasoning: 'The ZIP code 90210 belongs to California, which matches the provided state. However, cross-referencing with USPS database suggests a potential discrepancy in the street address format.' },
        { field: 'NPI', issue: 'NPI number not found in national registry.', confidence: 0.82, value: '0987654321', reasoning: 'The NPI provided did not return a valid result from the NPPES NPI Registry. This could be a typo or an inactive NPI.' },
        { field: 'CV/Resume', issue: 'Gap in employment history (3 months).', confidence: 0.65, value: 'Missing: Jan 2020 - Mar 2020', reasoning: 'A 3-month gap was detected between two listed employment periods. This may require clarification from the provider.' },
    ],
    'default': [
        { field: 'Address', issue: 'ZIP code mismatch with state.', confidence: 0.95, value: '90210', reasoning: 'The ZIP code 90210 belongs to California, which matches the provided state. However, cross-referencing with USPS database suggests a potential discrepancy in the street address format.' },
    ]
};

const timelines: Record<string, TimelineEvent[]> = {
    'APP-001': [
        { by: 'System', comment: 'Application received manually.', time: '2 days ago', type: 'SYSTEM' },
        { by: 'AI Assistant', comment: '2 potential issues detected.', time: '2 day ago', type: 'AI' },
        { by: 'Barry Allen', comment: 'Assigned to self for verification.', time: '4 hours ago', type: 'USER' },
    ],
    'default': [
        { by: 'System', comment: 'Application received.', time: '3 days ago', type: 'SYSTEM' },
    ]
};
const documentsStatus: Record<string, DocumentStatus[]> = {
    'default': [
        {
            fileType: "npi",
            status: "Verified",
            progress: 100,
            ocrData: {
                npi: "1093382830",
                npi_confident_score: 1.0,
                "Enumeration Date": "2021-06-09",
                Enumeration_Date_confident_score: 1.0,
                Status: "Active",
                Status_confident_score: 1.0,
                "Primary Practice Address":
                    "1277 KELLY JOHNSON BLVD STE 160 COLORADO SPRINGS, CO 80920-3992",
                Primary_Practice_Address_confident_score: 1.0,
            },
            pdfMatch: {
                match: true,
                reason:
                    "Both documents have a similar layout with key fields like Name, NPI, Mailing Address, and Primary/Secondary Practice Addresses positioned consistently.",
                confidance_score: 0.85,
            },
        },
        {
            fileType: "degree",
            status: "Pending",
            progress: 50,
            ocrData: {
                type: "MD",
                type_confident_score: 1.0,
                issueDate: "2010-05-20",
                issueDate_confident_score: 1.0,
                institution: "Stanford University",
                institution_confident_score: 1.0,
                confidence: { type: 92, number: 0, issueDate: 88, expiryDate: 0 },
            },
        },
        {
            fileType: "cv/resume", status: "Pending", progress: 25,
            pdfMatch: {
                match: false,
                reason: "",
                confidance_score: 0.92,
            },
        },
        {
            fileType: "dl",
            status: "Flagged",
            progress: 75,
            ocrData: {
                fn: "Tom",
                fn_confident_score: 1.0,
                dl: "OL11231L",
                dl_confident_score: 1.0,
                ln: "Jerry",
                ln_confident_score: 1.0,
                class: "C",
                class_confident_score: 1.0,
                dob: "08/20/1989",
                dob_confident_score: 1.0,
                sex: "F",
                sex_confident_score: 1.0,
                hair: "BLK",
                hair_confident_score: 1.0,
                eyes: "BLK",
                eyes_confident_score: 1.0,
                hgt: "5-10",
                hgt_confident_score: 1.0,
                wgt: "140 lb",
                wgt_confident_score: 1.0,
                exp: "08/31/2025",
                exp_confident_score: 1.0,
            },
            pdfMatch: {
                match: true,
                reason:
                    "DL fields such as name, date of birth, and class are present and aligned with standard DL layout.",
                confidance_score: 0.92,
            },
        },
        {
            fileType: "passport", status: "Verified", progress: 100,
            ocrData: {
                fn: "Tom",
                fn_confident_score: 1.0,
                dl: "OL11231L",
                dl_confident_score: 1.0,
                ln: "Jerry",
                ln_confident_score: 1.0,
            },
        },
    ],
};


const verificationCentres = {
    // "ml": [
    //     { name: "CA Medical Board", state: "CA", address: "2005 Evergreen St, Sacramento, CA 95815", email: "verify@mbc.ca.gov", type: "State Board" },
    //     { name: "NY State Education Dept", state: "NY", address: "89 Washington Ave, Albany, NY 12234", email: "opverify@nysed.gov", type: "State Dept" },
    //     { name: "TX Medical Board", state: "TX", address: "1801 Congress Ave, Austin, TX 78701", email: "verifications@tmb.state.tx.us", type: "State Board" },
    // ],
    "medical-training": [
        { name: "ECFMG (International)", state: "PA", address: "3624 Market St, Philadelphia, PA 19104", email: "verify@ecfmg.org", type: "Non-profit" },
        { name: "FCVS (FSMB)", state: "TX", address: "400 Fuller Wiser Rd, Euless, TX 76039", email: "fcvs@fsmb.org", type: "Non-profit" },
        { name: "Stanford University Registrar", state: "CA", address: "459 Lagunita Drive, Stanford, CA 94305", email: "registrar@stanford.edu", type: "University" },
    ],
    // "npi": [
    //     { name: "NPPES (CMS)", state: "Federal", address: "7500 Security Blvd, Baltimore, MD 21244", email: "npi@cms.hhs.gov", type: "Federal Agency" },
    // ],
    "passport": [
        { name: "National Passport Info Center", state: "Federal", address: "1111 19th St NW, Washington, DC 20036", email: "npic@state.gov", type: "Federal Agency" },
    ],
    "malpractice-history": [
        { name: "National Practitioner Data Bank", state: "Federal", address: "P.O. Box 10828, Chantilly, VA 20153", email: "help@npdb.hrsa.gov", type: "Federal Agency" },
    ],
    "dl": [
        { name: "California DMV", state: "CA", address: "2415 1st Ave, Sacramento, CA 95818", email: "records@dmv.ca.gov", type: "DMV" },
        { name: "New York DMV", state: "NY", address: "6 Empire State Plaza, Albany, NY 12228", email: "verify@dmv.ny.gov", type: "DMV" },
    ],
    //   "dea": [
    //     { name: "Drug Enforcement Administration", state: "Federal", address: "8701 Morrissette Dr, Springfield, VA 22152", email: "verification@dea.gov", type: "Federal Agency" },
    //   ],
    "cv/resume": [
        { name: "General Hospital HR", state: "CA", address: "123 Health St, Medville, CA 90210", email: "hr@generalhospital.com", type: "Employer" },
    ]
};

const allVerificationCentresList: VerificationCentre[] = Object.values(verificationCentres).flat();


const providersByOrg: Record<string, string[]> = {
    "CA Medical Board": ["Dr. John Smith", "Dr. Emily White", "Dr. Robert King", "Dr. Kevin Lee"],
    "NY State Education Dept": ["Dr. Michael Brown", "Dr. Linda Martinez", "Dr. James Lee"],
    "TX Medical Board": ["Dr. Sarah Miller", "Dr. Karen Hall"],
    "California DMV": ["Dr. Tom Jerry"],
    "Drug Enforcement Administration": ["Dr. Jessica Garcia"],
    "ECFMG (International)": ["Dr. Emily White"],
    "FCVS (FSMB)": ["Dr. John Smith", "Dr. Michael Brown"],
    "NPPES (CMS)": ["Dr. Tom Jerry", "Dr. Linda Martinez"],
    "National Passport Info Center": ["Dr. Sarah Miller"],
    "National Practitioner Data Bank": ["Dr. David Wilson", "Dr. Jessica Garcia"],
    "New York DMV": ["Dr. Steven Young"]
};


const emails: Email[] = [
    { id: 1, from: 'Dr. John Smith', subject: 'Re: Missing Document', date: '2 hours ago', unread: true },
    { id: 2, from: 'CA Medical Board', subject: 'Verification Complete for E. White', date: '1 day ago', unread: false },
    { id: 3, from: 'System Reminder', subject: 'Follow-up required for APP-003', date: '2 days ago', unread: false },
];

const selectedEmail: Email = {
    id: 1,
    from: 'Dr. John Smith',
    to: 'Me',
    subject: 'Re: Missing Document',
    date: '2 hours ago',
    unread: true,
    body: `Hello,\n\nI have attached the missing degree certificate you requested.\n\nPlease let me know if there is anything else you need.\n\nBest,\nDr. John Smith`,
    thread: [
        { from: 'Credentialing Dept', body: 'Dear Dr. Smith, we are missing your degree certificate. Please provide it at your earliest convenience.' }
    ]
};

const recentReports: Report[] = [
    { name: "Q4 2023 Credentialing Summary", date: "2024-01-05", type: "PDF" },
    { name: "Active Cardiology Roster", date: "2024-01-02", type: "Excel" },
    { name: "Pending Applications - CA Market", date: "2023-12-28", type: "Excel" },
];


export const kpiData = {
    totalApplications: { value: '1,250', change: '+15.2%', label: 'Total Applications', trend: [{ month: 'Jan', value: 100 }, { month: 'Feb', value: 120 }, { month: 'Mar', value: 150 }, { month: 'Apr', value: 130 }, { month: 'May', value: 180 }, { month: 'Jun', value: 200 }] },
    completed: { value: '890', change: '+10.1%', label: 'Completed', trend: [{ month: 'Jan', value: 70 }, { month: 'Feb', value: 80 }, { month: 'Mar', value: 90 }, { month: 'Apr', value: 85 }, { month: 'May', value: 100 }, { month: 'Jun', value: 110 }] },
    inProgress: { value: '250', change: '+5.5%', label: 'In-Progress', trend: [{ month: 'Jan', value: 20 }, { month: 'Feb', value: 25 }, { month: 'Mar', value: 30 }, { month: 'Apr', value: 28 }, { month: 'May', value: 40 }, { month: 'Jun', value: 45 }] },
    notStarted: { value: '95', change: '-2.0%', label: 'Not Started', trend: [{ month: 'Jan', value: 10 }, { month: 'Feb', value: 12 }, { month: 'Mar', value: 15 }, { month: 'Apr', value: 13 }, { month: 'May', value: 20 }, { month: 'Jun', value: 25 }] },
    needsReview: { value: '15', change: '+25%', label: 'Needs Further Review', trend: [{ month: 'Jan', value: 1 }, { month: 'Feb', value: 2 }, { month: 'Mar', value: 4 }, { month: 'Apr', value: 3 }, { month: 'May', value: 5 }, { month: 'Jun', value: 6 }] },
};

export const donutChartData = [
    { name: 'Approved', value: 890 },
    { name: 'Rejected', value: 110 },
    { name: 'Pending Review', value: 250 },
    { name: 'In-Progress', value: 95 },
];

export const barChartData = [
    { month: 'Jan', avgTime: 22 },
    { month: 'Feb', avgTime: 25 },
    { month: 'Mar', avgTime: 19 },
    { month: 'Apr', avgTime: 28 },
    { month: 'May', avgTime: 24 },
    { month: 'Jun', avgTime: 21 },
];

export const summaryTiles = [
    { title: 'Providers Awaiting Action', value: '5', icon: Users, items: [] },
    { title: 'Payers Awaiting Action', value: '4', icon: HandPlatter, items: [] },
    { title: 'Verification Centres Awaiting Action', value: '5', icon: Building, items: [] },
    { title: 'Follow-up / Reminder Pending', value: '3', icon: Mail, items: [] },
];

// Simulate API calls
const api = {
    getApplications: async (): Promise<Application[]> => {
        return new Promise(resolve => resolve(applications));
    },
    getApplicationById: async (id: string): Promise<Application | undefined> => {
        return new Promise(resolve => resolve(applications.find(app => app.id === id)));
    },
    getAiIssues: async (appId: string): Promise<AiIssue[]> => {
        return new Promise(resolve => resolve(aiIssues[appId] || aiIssues['default']));
    },
    getTimeline: async (appId: string): Promise<TimelineEvent[]> => {
        return new Promise(resolve => resolve(timelines[appId] || timelines['default']));
    },
    getDocumentsStatus: async (appId: string): Promise<DocumentStatus[]> => {
        return new Promise(resolve => resolve(documentsStatus[appId] || documentsStatus['default']));
    },
    getVerificationCentres: async (): Promise<Record<string, VerificationCentre[]>> => {
        return new Promise(resolve => resolve(verificationCentres));
    },
    getVerificationCentreByName: async (name: string): Promise<VerificationCentre | undefined> => {
        return new Promise(resolve => resolve(allVerificationCentresList.find(c => c.name === name)));
    },
    getVerificationCentreForDoc: async (docName: string): Promise<VerificationCentre | undefined> => {
        const centers = (verificationCentres as any)[docName];
        return new Promise(resolve => resolve(centers ? centers[0] : undefined));
    },
    getProvidersByOrg: async (): Promise<Record<string, string[]>> => {
        return new Promise(resolve => resolve(providersByOrg));
    },
    getUnverifiedProvidersForOrg: async (orgName: string): Promise<Application[]> => {
        const providerNames = providersByOrg[orgName] || [];
        return new Promise(resolve => resolve(applications.filter(app => providerNames.includes(app.name) && app.status !== 'Completed' && app.status !== 'Closed')));
    },
    getEmails: async (): Promise<Email[]> => {
        return new Promise(resolve => resolve(emails));
    },
    getEmailById: async (id: number): Promise<Email | undefined> => {
        const email = emails.find(e => e.id === id);
        if (email) {
            return new Promise(resolve => resolve({
                ...selectedEmail,
                id: email.id,
                from: email.from,
                subject: email.subject,
                date: email.date,
                unread: email.unread
            }));
        }
        return new Promise(resolve => resolve(selectedEmail));
    },
    getRecentReports: async (): Promise<Report[]> => {
        return new Promise(resolve => resolve(recentReports));
    }
};

export default api;
