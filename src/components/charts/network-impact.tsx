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



export function NetworkImpact() {
const providers = mockDatabase.getProviders();
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
            {['High', 'Medium', 'Low'].map((impact) => {
                const count = providers.filter(p => p.networkImpact === impact).length;
                const percentage = providers.length > 0 ? (count / providers.length) * 100 : 0;
                const colors = {
                    'High': '#f44336',
                    'Medium': '#ff9800',
                    'Low': '#4caf50'
                };

                return (
                    <Box key={impact} sx={{ textAlign: 'center' }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            backgroundColor: colors[impact],
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
                                background: `conic-gradient(${colors[impact]} ${percentage * 3.6}deg, #f5f5f5 ${percentage * 3.6}deg)`,
                                padding: 4
                            }
                        }}>
                            <Typography variant="h6" sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {count}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {impact} Impact
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {percentage.toFixed(1)}%
                        </Typography>
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
