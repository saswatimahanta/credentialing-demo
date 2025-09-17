
'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { communicationTabs } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, PlusCircle } from "lucide-react"
import mockApi, { type Email } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

const mockCalls = [
    { id: 1, to: 'Dr. John Smith', date: '2024-07-28', duration: '5 min', summary: 'Discussed missing document.'},
    { id: 2, to: 'CA Medical Board', date: '2024-07-27', duration: '12 min', summary: 'Verified license for E. White.'},
];

const mockMeetings = [
    { id: 1, title: 'Review APP-003', with: 'Charlie Davis', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '10:00 AM' },
    { id: 2, title: 'Credentialing Committee Sync', with: 'Team', date: new Date(new Date().setDate(new Date().getDate() + 5)), time: '2:00 PM' },
];

const mockReminders = [
    { id: 1, title: 'Follow-up with Dr. Michael Brown on APP-003', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), completed: false },
    { id: 2, title: 'Check status of TX DMV verification', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), completed: false },
    { id: 3, title: 'Prepare Q3 report summary', dueDate: new Date(new Date().setDate(new Date().getDate() -1)), completed: true },
]

export default function CommunicationPage() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [activeTab, setActiveTab] = useState('email');
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    useEffect(() => {
        if (activeTab === 'email') {
            const fetchData = async () => {
                const emailList = await mockApi.getEmails();
                setEmails(emailList);
                if(emailList.length > 0) {
                    const detailedEmail = await mockApi.getEmailById(emailList[0].id);
                    setSelectedEmail(detailedEmail || null);
                }
            };
            fetchData();
        }
    }, [activeTab]);

    const handleSelectEmail = async (emailId: number) => {
        const detailedEmail = await mockApi.getEmailById(emailId);
        setSelectedEmail(detailedEmail || null);
    }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Communication Center</h1>

        <Tabs defaultValue="email" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
                 {communicationTabs.map((tab) => (
                    <TabsTrigger 
                        value={tab.value} 
                        key={tab.value} 
                        className={cn("gap-2", activeTab === tab.value && 'bg-primary text-primary-foreground')}
                    >
                        <tab.icon className="h-4 w-4"/> {tab.label}
                    </TabsTrigger>
                 ))}
            </TabsList>
            <TabsContent value="email">
                <Card>
                <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
                    <ResizablePanel defaultSize={30}>
                        <div className="p-4">
                            <div className="flex items-center gap-2">
                                <Select defaultValue="provider">
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="provider">Provider</SelectItem>
                                        <SelectItem value="center">Verification Center</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search emails..." className="pl-8" />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="p-2">
                            {emails.map(email => (
                                <div key={email.id} className={`p-3 rounded-lg cursor-pointer ${selectedEmail?.id === email.id ? 'bg-accent' : 'hover:bg-muted'}`} onClick={() => handleSelectEmail(email.id)}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-sm">{email.from}</p>
                                        {email.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <p className="text-sm truncate">{email.subject}</p>
                                    <p className="text-xs text-muted-foreground">{email.date}</p>
                                </div>
                            ))}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={70}>
                        {selectedEmail ? (
                         <div className="flex flex-col h-full">
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold">{selectedEmail.subject}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://placehold.co/32x32.png" alt={selectedEmail.from} data-ai-hint="user avatar"/>
                                        <AvatarFallback>{selectedEmail.from.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{selectedEmail.from}</p>
                                        <p className="text-xs text-muted-foreground">to {selectedEmail.to}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                <p className="text-sm whitespace-pre-wrap">{selectedEmail.body}</p>
                                {selectedEmail.thread && selectedEmail.thread.length > 0 && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="bg-muted p-3 rounded-md">
                                            <p className="text-xs text-muted-foreground">On Jan 2, 2024, {selectedEmail.thread[0].from} wrote:</p>
                                            <blockquote className="text-sm italic border-l-2 pl-2 mt-1">{selectedEmail.thread[0].body}</blockquote>
                                        </div>
                                    </>
                                )}
                            </div>
                             <div className="p-4 border-t bg-background">
                                <Textarea placeholder="Type your reply... (use tags like @providerName, @documentName)" />
                                <div className="flex justify-end mt-2">
                                    <Button>Send</Button>
                                </div>
                            </div>
                         </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Select an email to read</p>
                            </div>
                        )}
                    </ResizablePanel>
                </ResizablePanelGroup>
                </Card>
            </TabsContent>
            <TabsContent value="call">
                <Card>
                    <CardHeader className='flex flex-row justify-between items-center'>
                        <div>
                            <CardTitle>Call Log</CardTitle>
                            <CardDescription>Log and review calls with providers and centers.</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className='mr-2' /> Log New Call</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log a New Call</DialogTitle>
                                </DialogHeader>
                                <div className='space-y-4 py-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor="call-to">Recipient</Label>
                                        <Input id="call-to" placeholder="e.g., Dr. John Smith" />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="call-duration">Duration (in minutes)</Label>
                                        <Input id="call-duration" type="number" placeholder="e.g., 15" />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="call-summary">Summary</Label>
                                        <Textarea id="call-summary" placeholder="Briefly describe the call..." />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Log</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Summary</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockCalls.map(call => (
                                    <TableRow key={call.id}>
                                        <TableCell className='font-medium'>{call.to}</TableCell>
                                        <TableCell>{call.date}</TableCell>
                                        <TableCell>{call.duration}</TableCell>
                                        <TableCell>{call.summary}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="meeting">
                 <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2'>
                        <Card>
                            <CardContent className='p-2'>
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md"
                                />
                            </CardContent>
                        </Card>
                    </div>
                    <div className='lg:col-span-1'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Meetings</CardTitle>
                                <CardDescription>Your scheduled meetings for the upcoming week.</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {mockMeetings.map(meeting => (
                                    <div key={meeting.id} className='flex items-start gap-4'>
                                        <div className='text-center rounded-md bg-muted px-2 py-1'>
                                            <p className='text-xs'>{meeting.date.toLocaleString('default', { month: 'short' })}</p>
                                            <p className='font-bold text-lg'>{meeting.date.getDate()}</p>
                                        </div>
                                        <div>
                                            <p className='font-semibold'>{meeting.title}</p>
                                            <p className='text-sm text-muted-foreground'>With: {meeting.with}</p>
                                            <p className='text-sm text-muted-foreground'>Time: {meeting.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Dialog>
                                    <DialogTrigger asChild>
                                         <Button className='w-full'><PlusCircle className='mr-2' /> Schedule Meeting</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Schedule a New Meeting</DialogTitle>
                                        </DialogHeader>
                                        <div className='space-y-4 py-4'>
                                             <div className='space-y-2'>
                                                <Label htmlFor="meet-title">Meeting Title</Label>
                                                <Input id="meet-title" placeholder="e.g., Application Review" />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor="meet-attendees">Attendees</Label>
                                                <Input id="meet-attendees" placeholder="e.g., Dr. Smith, Jane Doe" />
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor="meet-date">Date & Time</Label>
                                                <Input id="meet-date" type="datetime-local" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button>Schedule</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    </div>
                 </div>
            </TabsContent>
             <TabsContent value="reminders">
                <Card>
                    <CardHeader className='flex flex-row justify-between items-center'>
                        <div>
                            <CardTitle>Reminders</CardTitle>
                            <CardDescription>Manage your follow-ups and tasks.</CardDescription>
                        </div>
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className='mr-2' /> Add Reminder</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add a New Reminder</DialogTitle>
                                </DialogHeader>
                                <div className='space-y-4 py-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor="rem-title">Title</Label>
                                        <Input id="rem-title" placeholder="e.g., Follow up with..." />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="rem-date">Due Date</Label>
                                        <Input id="rem-date" type="date" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Reminder</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        {mockReminders.map(reminder => (
                            <div key={reminder.id} className={cn('flex items-center gap-4 p-3 rounded-md', reminder.completed ? 'bg-muted/50' : 'bg-card border')}>
                                <Checkbox checked={reminder.completed} className='h-5 w-5' />
                                <div className='flex-1'>
                                    <p className={cn('font-medium', reminder.completed && 'line-through text-muted-foreground')}>{reminder.title}</p>
                                    <p className={cn('text-sm', reminder.completed ? 'text-muted-foreground' : 'text-primary')}>{reminder.dueDate.toLocaleDateString()}</p>
                                </div>
                                <Button variant="ghost" size="sm">Dismiss</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

    