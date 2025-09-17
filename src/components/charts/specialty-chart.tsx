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



export function SpecialtyChart() {
  const providers = mockDatabase.getProviders();
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Top Specialties</CardTitle>
        <CardDescription>
          Overview of all application statuses.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
              {['In Progress', 'Committee Review', 'Approved', 'Initiated', 'Denied'].map((status) => {
                const count = providers.filter(p => p.status === status).length;
                const percentage = providers.length > 0 ? (count / providers.length) * 100 : 0;
                const colors = {
                  'Initiated': '#2196f3',
                  'In Progress': '#ff9800',
                  'Committee Review': '#9c27b0',
                  'Approved': '#4caf50',
                  'Denied': '#f44336'
                };

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
