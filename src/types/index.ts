export enum Status {
    DONE = 'DONE',
    NOT_DONE = 'NOT_DONE',
}

export interface Device {
    deviceId: string;
    taskName: string;
    // Aligning with DeviceData from apiService.ts
    currentStatus?: 'DONE' | 'NOT_DONE'; 
    lastUpdatedAt?: string; // Making it optional to match DeviceData
    createdAt?: string; // Adding createdAt to match DeviceData
    updatedAt?: string; // Adding updatedAt to match DeviceData
}

export interface HistoryEntry {
    timestamp: string; // Changed from 'date' to 'timestamp'
    status: Status;
    logId?: string; // Add logId as optional, as it's returned by API
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// New interfaces moved from apiService.ts
export interface AuthPayload {
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string; // Optional token for future use
}

export interface DeviceRegistrationPayload {
    deviceId: string;
    taskName: string;
}

export interface DeviceRegistrationResponse {
    message: string;
    device?: Device;
}
