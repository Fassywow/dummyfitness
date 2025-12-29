// Message Central Auth Service (REST API)

const CUSTOMER_ID = import.meta.env.VITE_MSG_CENTRAL_CUSTOMER_ID;
const AUTH_TOKEN = import.meta.env.VITE_MSG_CENTRAL_AUTH_TOKEN;

// Helper to validate config
const checkConfig = () => {
    if (!CUSTOMER_ID || !AUTH_TOKEN) {
        throw new Error("Message Central Credentials missing in .env");
    }
};

export interface VerificationResponse {
    verificationId: string;
    responseCode: string;
    message: string;
}

export const sendOtp = async (phoneNumber: string): Promise<string> => {
    checkConfig();

    // Format phone number: Remove spaces, ensure it starts with country code (assuming +91 for India if missing, or user provides it)
    // Message Central usually expects number without '+' or with specific format. 
    // Let's strip special chars first.
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${CUSTOMER_ID}&flowType=SMS&mobileNumber=${cleanNumber.slice(-10)}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'authToken': AUTH_TOKEN
            }
        });

        const data = await response.json();
        console.log("Send OTP Response:", data);

        if (data.responseCode === 200 || data.responseCode === "200") {
            return data.data.verificationId;
        } else {
            throw new Error(data.message || "Failed to send OTP");
        }
    } catch (error) {
        console.error("Error sending OTP via Message Central:", error);
        throw error;
    }
};

export const verifyOtp = async (verificationId: string, otp: string, phoneNumber: string): Promise<boolean> => {
    checkConfig();
    const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${verificationId}&code=${otp}`;

    try {
        const response = await fetch(url, {
            method: 'GET', // Documentation usually says GET for validate, but we should verify. Assuming GET based on query params structure.
            headers: {
                'authToken': AUTH_TOKEN
            }
        });

        const data = await response.json();
        console.log("Verify OTP Response:", data);

        if (data.responseCode === 200 || data.responseCode === "200") {
            // Success!
            // Create a consistent session using phone number
            const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
            const sessionUser = {
                uid: `user_${cleanNumber}`,
                phoneNumber: phoneNumber,
                providerId: 'message_central'
            };
            localStorage.setItem('health_app_user', JSON.stringify(sessionUser));
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error verifying OTP via Message Central:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('health_app_user');
    window.location.href = "/login";
};

// Simple hook to check if logged in
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('health_app_user');
    return userStr ? JSON.parse(userStr) : null;
};
