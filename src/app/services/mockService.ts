import { Device, Status } from '@/types';
import { API_SIMULATION_DELAY } from '@/constants';

const DEVICE_STORAGE_KEY = 'iot_devices';

const getStoredDevices = (): Device[] => {
    if (typeof window == 'undefined') return [];
    const stored = localStorage.getItem(DEVICE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const storeDevices = (devices: Device[]) => {
    if (typeof window == 'undefined') return;
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
};

// Simulate daily reset for devices if not accessed on a new day.
// This is a simplified frontend simulation. In reality, backend/device handles this.
// const simulateDailyResetIfNeeded = (device: Device): Device => {
//   if (typeof window === 'undefined') return device;
//   const lastResetKey = `iot_dashboard_last_reset_${device.deviceId}`;
//   const today = new Date().toISOString().split('T')[0];
//   const lastResetDate = localStorage.getItem(lastResetKey);

//   if (lastResetDate !== today) {
//     // If status is DONE, reset to NOT_DONE
//     if (device.status === Status.DONE) {
//         const updatedDevice = { ...device, status: Status.NOT_DONE };
//         // Also add a history entry for this reset
//         const history = getStoredHistory(device.deviceId);
//         const resetEntry: HistoryEntry = { date: today, status: Status.NOT_DONE };
//         const newHistory = [resetEntry, ...history.filter(h => h.date !== today)];
//         storeHistory(device.deviceId, newHistory);
//         localStorage.setItem(lastResetKey, today);
//         return updatedDevice;
//     }
//     // If it wasn't DONE, just mark today as "checked" for reset logic.
//     localStorage.setItem(lastResetKey, today);
//   }
//   return device;
// };

export const mockApi = {
    registerDevice: async (deviceId: string, taskName: string): Promise<Device> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (typeof window == 'undefined') {
                    reject(new Error('localStorage is not available'));
                    return;
                }
                const devices = getStoredDevices();
                if (devices.find(d => d.deviceId === deviceId)) {
                    reject(new Error('Device with this ID already exists.'));
                    return;
                }
                const newDevice: Device = {
                    deviceId,
                    taskName,
                    status: Status.NOT_DONE,
                    lastUpdatedAt: new Date().toISOString(),
                };
                storeDevices([...devices, newDevice]);
                // Initialize history with a "NOT_DONE" status for today
                // const today = new Date().toISOString().split('T')[0];
                // storeHistory(deviceId, [{date: today, status: Status.NOT_DONE}]);
                // localStorage.setItem(`iot_dashboard_last_reset_${deviceId}`, today);

                resolve(newDevice);
            }, API_SIMULATION_DELAY);
        });
    },

    getDevices: async (): Promise<Device[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (typeof window == 'undefined') {
                    resolve([]);
                    return;
                }
                let devices = getStoredDevices();
                // Simulate daily reset logic on fetch
                // devices = devices.map(simulateDailyResetIfNeeded);
                // storeDevices(devices); // Store updated devices if any changes were made

                resolve(devices);
            }, API_SIMULATION_DELAY);
        });
    },
};