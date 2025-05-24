export interface AuthPayload {
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string; // Optional token for future use
}

export interface DeviceData {
    deviceId: string;
    taskName: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeviceRegistrationPayload {
    deviceId: string;
    taskName: string;
}

export interface DeviceRegistrationResponse {
    message: string;
    device?: DeviceData;
}

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
    
        const responseData: DeviceRegistrationResponse = await response.json();
    
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