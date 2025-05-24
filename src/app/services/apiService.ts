// Import all necessary types from '@/types'
import {
    Device,
    AuthPayload,
    AuthResponse,
    DeviceRegistrationPayload,
    DeviceRegistrationResponse,
} from '@/types';

export async function authenticate(
    payload: AuthPayload
): Promise<AuthResponse> {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    
        const responseData: AuthResponse = await response.json();
    
        if (!response.ok) {
            return responseData;
        }
    
        if (responseData.success) {
            // Store the token in session storage or cookies in the future
            console.log('Login successful:', responseData.message);
        }
    
        return responseData;

    } catch (error: any) {
        console.error('Error during authentication:', error);
        return {
            success: false,
            message: error.message || 'An error occurred during authentication by client side.',
        };
    }
}

export async function registerDevice(
    devicePayload: DeviceRegistrationPayload
): Promise<DeviceRegistrationResponse> {
    try {
        const response = await fetch('/api/devices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(devicePayload),
        });
    
        const responseData: { message: string, device?: Device } = await response.json(); // Expecting Device
    
        if (!response.ok) {
            throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
        }
    
        return responseData;

    } catch (error: any) {
        console.error('Error during device registration:', error);
        return {
            message: error.message || 'An error occurred during device registration by client side.',
        };
    }
}

export async function getAllDevices(): Promise<Device[] | {message: string}> { // Changed to Device[]
    try {
        const response = await fetch('/api/devices', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    
        // The API returns { devices: Device[] }, so we need to extract it.
        const responseData: { devices: Device[] } = await response.json(); // Expecting Device[]
        return responseData.devices;

    } catch (error: any) {
        console.error('Error fetching devices:', error);
        return { message: error.message || 'An error occurred while fetching devices by client side.' };
    }
}

export async function deleteDevice(deviceId: string): Promise<void> {
    try {
        const response = await fetch(`/api/devices/${deviceId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // No content expected for 204 No Content, but API spec says 200 OK with message.
        // We can just return void if response.ok is true.
        return;

    } catch (error: any) {
        console.error(`Error deleting device ${deviceId}:`, error);
        throw new Error(error.message || 'An error occurred during device deletion by client side.');
    }
}

export async function updateTaskName(
    deviceId: string,
    newTaskName: string,
    resetHistory: boolean
): Promise<Device> {
    try {
        const response = await fetch(`/api/devices/${deviceId}/task`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskName: newTaskName, resetHistory }),
        });

        const responseData: { message: string, device: Device } = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
        }

        return responseData.device;

    } catch (error: any) {
        console.error(`Error updating task name for device ${deviceId}:`, error);
        throw new Error(error.message || 'An error occurred during task name update by client side.');
    }
}

// export async function getDeviceDetails(
//     deviceId: string
// ): Promise<Device | { message: string } | null> { // Changed to Device
//     try {
//         if (!deviceId) {
//             return { message: 'Device ID is required.' };
//         }
//         // IMPORTANT: The current /api/devices/route.ts does NOT have a GET by ID.
//         // This function will not work as intended until that API endpoint is implemented.
//         // For now, this is a placeholder.
//         const response = await fetch(`/api/devices/${deviceId}`, { 
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             if (response.status === 404) {
//                 return null;
//             }
//             const errorData = await response.json();
//             throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//         }

//         const device: Device = await response.json(); // Expecting Device
//         return device;

//     } catch (error: any) {
//         console.error('Error fetching device details:', error);
//         return { message: error.message || 'An error occurred while fetching device details by client side.' };
//     }
// }
