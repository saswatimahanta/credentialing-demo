// @ts-nocheck
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import mockDatabase from '../committee-review/mockDatabase';

export function SpecialtyChart({ data, market }) {
  console.log('data', data)
  // Static proposed counts out of 250 total as per requirements
  const total = 250;

  const allData = [
    { status: 'In Progress', count: 75, percentage: 30.0 },
    { status: 'Committee Review', count: 62, percentage: 24.8  },
    { status: 'Approved', count: 50, percentage: 20.0  },
    { status: 'Initiated', count: 38, percentage: 15.2  },
    { status: 'Denied', count: 25, percentage: 10.0  }
  ];
  const dataToDisplay = market === 'ca' ? data : allData
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Top 5 Specialties</CardTitle>
        <CardDescription>
          Overview of all application statuses.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
              {dataToDisplay.map(({ status, count, percentage }) => {
                // const percentage = (count / total) * 100;
                const colors = {
                  'Internal Medicine': '#2196f3',
                  'Pediatrics': '#ff9800',
                  'Psychologist': '#9c27b0',
                  'Cardiovascular Disease': '#4caf50',
                  'Obstetrics & Gynecology': '#f44336',
                  'In Progress': '#2196f3',
                  'Committee Review': '#ff9800',
                  'Approved': '#9c27b0',
                  'Initiated': '#4caf50',
                  'Denied': '#f44336'
                } as Record<string, string>;

                return (
                  <Box key={status} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {status}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {count} ({percentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <Box sx={{
                      height: 20,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 10,
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <Box sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: colors[status],
                        transition: 'width 0.5s ease-in-out',
                        borderRadius: 10
                      }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="flex gap-2 font-medium leading-none">
      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    </div>
    <div className="leading-none text-muted-foreground">
      Showing total applications for the last 6 months
    </div>
  </CardFooter> */}
    </Card>
  );
}
