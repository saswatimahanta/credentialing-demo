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
export function NetworkImpact() {
  const total = 250;
  const distribution = [
    { impact: 'High', count: 113, percent: (113 / total) * 100, color: '#f44336' },
    { impact: 'Medium', count: 100, percent: (100 / total) * 100, color: '#ff9800' },
    { impact: 'Low', count: 37, percent: (37 / total) * 100, color: '#4caf50' }
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Network Impact Analysis</CardTitle>
        <CardDescription>
          Overview of all application statuses.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '200px' }}>
              {distribution.map(d => (
                <Box key={d.impact} sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: d.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: `conic-gradient(${d.color} ${d.percent * 3.6}deg, #f5f5f5 ${d.percent * 3.6}deg)`,
                      padding: 4
                    }
                  }}>
                    <Typography variant="h6" sx={{
                      color: 'black',
                      fontWeight: 'bold',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {d.count}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {d.impact} Impact
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {d.percent.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
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
