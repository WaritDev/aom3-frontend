'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'penalty';
  title: string;
  description: string;
  amount?: string;
  timestamp: string;
  status: 'success' | 'pending' | 'warning';
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'reward',
    title: 'Weekly Rewards Credited',
    description: 'Pro tier - Week 6 completed',
    amount: '+$125.00',
    timestamp: '2 hours ago',
    status: 'success',
  },
  {
    id: '2',
    type: 'deposit',
    title: 'New Deposit',
    description: 'Saver tier - 30 days lock',
    amount: '$4,200.00',
    timestamp: '1 day ago',
    status: 'success',
  },
  {
    id: '3',
    type: 'reward',
    title: 'Milestone Bonus',
    description: 'Completed 90 days streak',
    amount: '+$50.00',
    timestamp: '3 days ago',
    status: 'success',
  },
  {
    id: '4',
    type: 'withdrawal',
    title: 'Withdrawal Completed',
    description: 'Try-out tier matured',
    amount: '$3,250.00',
    timestamp: '5 days ago',
    status: 'success',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'deposit':
      return <ArrowDownLeft size={20} />;
    case 'withdrawal':
      return <ArrowUpRight size={20} />;
    case 'reward':
      return <Award size={20} />;
    case 'penalty':
      return <AlertTriangle size={20} />;
    default:
      return <ArrowDownLeft size={20} />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'deposit':
      return '#4caf50';
    case 'withdrawal':
      return '#2196f3';
    case 'reward':
      return '#E89C4A';
    case 'penalty':
      return '#f44336';
    default:
      return '#4caf50';
  }
};

export default function RecentActivity() {
  return (
    <Card sx={{ bgcolor: '#1a1a1a', borderColor: '#2d2d2d' }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Recent Activity
        </Typography>

        <List sx={{ p: 0 }}>
          {MOCK_ACTIVITIES.map((activity, index) => {
            const color = getActivityColor(activity.type);
            return (
              <ListItem
                key={activity.id}
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom: index < MOCK_ACTIVITIES.length - 1 ? '1px solid #2d2d2d' : 'none',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: `${color}20`,
                    color: color,
                    mr: 2,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" component="span" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Box component="span">
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block' }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="span" sx={{ mt: 0.5, display: 'block' }}>
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  }
                />
                {activity.amount && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      color: activity.amount.startsWith('+') ? '#4caf50' : 'text.primary',
                    }}
                  >
                    {activity.amount}
                  </Typography>
                )}
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
