import { Status } from '@/types';

export const STATUS_DISPLAY: Record<Status, string> = {
    [Status.DONE]: 'Done',
    [Status.NOT_DONE]: 'Not Done',
};

export const API_SIMULATION_DELAY = 1000; // ms