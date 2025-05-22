import { Device, Status, HistoryEntry } from '@/types';
import { API_SIMULATION_DELAY } from '@/constants';

const DEVICE_STORAGE_KEY = 'iot_devices';
const HISTORY_STORAGE_KEY_PREFIX = `iot_devices_history_`;

const getStoredDevices = (): Device[] => {
    if (typeof window == 'undefined') return [];
    const stored = localStorage.getItem(DEVICE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const storeDevices = (devices: Device[]) => {
    if (typeof window == 'undefined') return;
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
};

const getStoredHistory = (deviceId: string): HistoryEntry[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`${HISTORY_STORAGE_KEY_PREFIX}${deviceId}`);
    return stored ? JSON.parse(stored) : [];
};

const storeHistory = (deviceId: string, history: HistoryEntry[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${deviceId}`, JSON.stringify(history));
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

                const devices = getStoredDevices();
                // let devices = getStoredDevices();
                
                // Simulate daily reset logic on fetch
                // devices = devices.map(simulateDailyResetIfNeeded);
                // storeDevices(devices); // Store updated devices if any changes were made

                resolve(devices);
            }, API_SIMULATION_DELAY);
        });
    },

    // updateDeviceStatusFromESP: async (deviceId: string, status: Status, timestamp: string): Promise<Device> => {
    //     console.log(`ESP32 reported status for ${deviceId}: ${status} at ${timestamp}`);
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             if (typeof window === 'undefined') {
    //                 reject(new Error('localStorage is not available.'));
    //                 return;
    //             }
    //             const devices = getStoredDevices();
    //             const deviceIndex = devices.findIndex(d => d.deviceId === deviceId);
    //             if (deviceIndex === -1) {
    //                 reject(new Error('Device not found.'));
    //                 return;
    //             }
    //             const updatedDevice = { ...devices[deviceIndex], status };
    //             devices[deviceIndex] = updatedDevice;
    //             storeDevices(devices);

    //             // Update history
    //             const history = getStoredHistory(deviceId);
    //             const today = new Date(timestamp).toISOString().split('T')[0]; // Use reported timestamp's date
    //             const existingEntryIndex = history.findIndex(h => h.date === today);
    //             if (existingEntryIndex !== -1) {
    //                 history[existingEntryIndex] = { date: today, status };
    //             } else {
    //                 history.unshift({ date: today, status });
    //             }
    //             storeHistory(deviceId, history.slice(0, 365)); // Keep up to a year of history
    //             localStorage.setItem(`iot_dashboard_last_reset_${deviceId}`, today.split('-')[0] !== new Date(localStorage.getItem(`iot_dashboard_last_reset_${deviceId}`) || '1970-01-01').getFullYear().toString() ? today : localStorage.getItem(`iot_dashboard_last_reset_${deviceId}`) || today);

    //             resolve(updatedDevice);
    //         }, API_SIMULATION_DELAY / 2); // Faster as it's a background update
    //     });
    // },

    getDeviceHistory: async (deviceId: string): Promise<HistoryEntry[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (typeof window === 'undefined') {
                    resolve([]);
                    return;
                }
                resolve(getStoredHistory(deviceId));
            }, API_SIMULATION_DELAY);
        });
    },

    updateTaskName: async (deviceId: string, newTaskName: string, resetHistory: boolean): Promise<Device> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (typeof window === 'undefined') {
                    reject(new Error('localStorage is not available'));
                    return;
                }
                const devices = getStoredDevices();
                const deviceIndex = devices.findIndex(d => d.deviceId === deviceId);
                if (deviceIndex === -1) {
                    reject(new Error('Device not found.'));
                    return;
                }
                devices[deviceIndex].taskName = newTaskName;
                storeDevices(devices);
                if (resetHistory) {
                    storeHistory(deviceId, []);
                    // If history is reset, also reset its status to NOT_DONE for today
                    devices[deviceIndex].status = Status.NOT_DONE;
                    const today = new Date().toISOString().split('T')[0];
                    storeHistory(deviceId, [{ date: today, status: Status.NOT_DONE }]);
                    localStorage.setItem(`iot_dashboard_last_reset_${deviceId}`, today);
                    storeDevices(devices);
                }
                resolve(devices[deviceIndex]);
            }, API_SIMULATION_DELAY);
        });
    },

    deleteDevice: async (deviceId: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (typeof window === 'undefined') {
                    resolve();
                    return;
                }
                const devices = getStoredDevices().filter(d => d.deviceId !== deviceId);
                storeDevices(devices);
                localStorage.removeItem(`${HISTORY_STORAGE_KEY_PREFIX}${deviceId}`);
                localStorage.removeItem(`iot_dashboard_last_reset_${deviceId}`);
                resolve();
            }, API_SIMULATION_DELAY);
        });
    },
};