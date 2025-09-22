"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVert } from '@mui/icons-material';
import { Box, Checkbox, Chip, IconButton, Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export default function CommitteeReviewTable({filteredProviders, selected, handleSelectAll, handleCheckboxClick, handleMenuOpen, getStatusColor, handleViewDetails, handleGenerateReport, handleOpenChat, handleStartApproval}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Checkbox
                            indeterminate={
                                selected.some(id => filteredProviders.some(p => p.id === id)) &&
                                selected.length < filteredProviders.length
                            }
                            checked={
                                filteredProviders.length > 0 &&
                                filteredProviders.every(p => selected.includes(p.id))
                            }
                            onChange={handleSelectAll}
                        />
                    </TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Analyst</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Network Impact</TableHead>
                    <TableHead><span className="sr-only">Actions</span>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProviders.map((provider) => {
                    const isChecked = selected.includes(provider.id);

                    return (
                    <TableRow key={provider.id} hover>
                        <TableCell padding="checkbox">
                        <Checkbox
                            checked={isChecked}
                            onChange={() => handleCheckboxClick(provider.id)}
                        />
                        </TableCell>
                        <TableCell>
                                {provider.name}
                                {/* ID: {provider.id} */}
                        </TableCell>
                        <TableCell>{provider.specialty}</TableCell>
                        <TableCell>{provider.market}</TableCell>
                        <TableCell>
                        <Chip
                            label={provider.status}
                            color={getStatusColor(provider.status)}
                            size="small"
                        />
                        </TableCell>
                        <TableCell>{provider.assignedAnalyst}</TableCell>
                        <TableCell>{provider.submissionDate}</TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                provider.networkImpact === "High"
                                    ? "destructive"
                                    : provider.networkImpact === "Medium"
                                    ? "secondary"
                                    : "default"
                                }
                            >{ provider.networkImpact}</Badge>
                        </TableCell>
                        <TableCell align="left">
                        {/* <IconButton
                            onClick={(e) => handleMenuOpen(e, provider)}
                            size="small"
                        >
                            <MoreVert />
                        </IconButton> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(provider)} >View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateReport(provider)}>Generate Report</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenChat(provider)}>Chat with AI</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStartApproval(provider)}>
                                    Approve/Deny
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    );
                })}
            </TableBody>
        </Table>
)}