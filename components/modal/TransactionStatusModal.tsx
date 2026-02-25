import { 
    Dialog, DialogContent, Stack, Box, Typography, 
    CircularProgress, Button, Fade, Zoom 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NEON_GREEN = '#00E08F';
const NEON_RED = '#FF4D4D';

interface TransactionStatusModalProps {
    open: boolean;
    status: 'processing' | 'success' | 'error';
    step: number;
    totalSteps: number;
    message: string;
    onClose: () => void;
}

export const TransactionStatusModal = ({ 
    open, 
    status, 
    step, 
    totalSteps, 
    message, 
    onClose 
}: TransactionStatusModalProps) => {
    
    return (
        <Dialog 
            open={open} 
            onClose={status !== 'processing' ? onClose : undefined}
            TransitionComponent={Fade}
            transitionDuration={400}
            PaperProps={{
                sx: {
                    bgcolor: '#050505',
                    border: `1px solid ${status === 'error' ? NEON_RED : NEON_GREEN}33`,
                    borderRadius: 5,
                    backgroundImage: 'none',
                    minWidth: 340,
                    boxShadow: status === 'error' 
                        ? `0 0 40px ${NEON_RED}15` 
                        : `0 0 40px ${NEON_GREEN}15`,
                }
            }}
        >
            <DialogContent sx={{ p: 5, textAlign: 'center' }}>
                <Stack spacing={4} alignItems="center">
                    
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {status === 'processing' && (
                            <>
                                <CircularProgress 
                                    variant="determinate" 
                                    value={100} 
                                    size={80} 
                                    thickness={2} 
                                    sx={{ color: 'rgba(255,255,255,0.05)', position: 'absolute' }} 
                                />
                                <CircularProgress 
                                    size={80} 
                                    thickness={4} 
                                    sx={{ 
                                        color: NEON_GREEN, 
                                        filter: `drop-shadow(0 0 8px ${NEON_GREEN}66)`,
                                        strokeLinecap: 'round'
                                    }} 
                                />
                                <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: NEON_GREEN, lineHeight: 1 }}>
                                        {step}<Box component="span" sx={{ fontSize: '0.6em', opacity: 0.5, mx: 0.2 }}>/</Box>{totalSteps}
                                    </Typography>
                                    <Typography sx={{ fontSize: 9, fontWeight: 900, color: NEON_GREEN, letterSpacing: 1, opacity: 0.8 }}>
                                        STEP
                                    </Typography>
                                </Box>
                            </>
                        )}

                        {status === 'success' && (
                            <Zoom in style={{ transitionDelay: '100ms' }}>
                                <CheckCircleIcon sx={{ fontSize: 80, color: NEON_GREEN, filter: `drop-shadow(0 0 15px ${NEON_GREEN}88)` }} />
                            </Zoom>
                        )}

                        {status === 'error' && (
                            <Zoom in>
                                <ErrorOutlineIcon sx={{ fontSize: 80, color: NEON_RED, filter: `drop-shadow(0 0 15px ${NEON_RED}88)` }} />
                            </Zoom>
                        )}
                    </Box>

                    <Box>
                        <Typography 
                            variant="h6" 
                            fontWeight={900} 
                            color="white" 
                            sx={{ 
                                letterSpacing: '-0.5px', 
                                textTransform: 'uppercase',
                                mb: 1 
                            }}
                        >
                            {status === 'processing' ? 'Executing Protocol' : status === 'success' ? 'Mission Success' : 'System Interrupted'}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'rgba(255,255,255,0.5)', 
                                fontWeight: 500, 
                                lineHeight: 1.6,
                                maxWidth: 240,
                                mx: 'auto'
                            }}
                        >
                            {message}
                        </Typography>
                    </Box>

                    {status !== 'processing' && (
                        <Button 
                            fullWidth 
                            variant="contained" 
                            onClick={onClose}
                            sx={{ 
                                bgcolor: status === 'error' ? NEON_RED : NEON_GREEN, 
                                color: '#000', 
                                fontWeight: 900,
                                py: 1.5,
                                borderRadius: 2,
                                boxShadow: `0 8px 20px ${status === 'error' ? NEON_RED : NEON_GREEN}33`,
                                '&:hover': { 
                                    bgcolor: '#FFF',
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 12px 25px ${status === 'error' ? NEON_RED : NEON_GREEN}44`,
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            {status === 'error' ? 'ACKNOWLEDGE & RETRY' : 'CONFIRM & EXIT'}
                        </Button>
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
};