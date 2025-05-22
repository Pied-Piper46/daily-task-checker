export enum Status {
    DONE = 'DONE',
    NOT_DONE = 'NOT_DONE',
}

export interface Device {
    deviceId: string;
    taskName: string;
    status: Status;
    lastUpdatedAt: string; // or Date
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}