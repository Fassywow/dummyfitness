import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getCurrentUser } from './authService';

export interface HealthData {
    date: string; // YYYY-MM-DD
    steps: number;
    water: number; // in ml
    sleep: number; // in hours
    calories: number; // kcal
    protein: number; // in grams
}

export interface UserProfile {
    name?: string;
    age: number;
    height: number; // cm
    weight: number; // kg
    bloodGroup: string;
    gender: 'male' | 'female' | 'other';
}

const getUserId = () => {
    const user = getCurrentUser();
    return user ? user.uid : null;
};

// We don't need getHealthData (all data) for the UI in this simple version, 
// usually we just need today's data or specific range. 
// But preserving basic signature if needed, though implementing "get ALL" in firestore means reading a collection.
// Let's stick to getTodayData which is what's used.

export const getTodayData = async (): Promise<HealthData> => {
    const uid = getUserId();
    if (!uid) throw new Error("User not logged in");

    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(db, 'users', uid, 'daily_logs', today);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as HealthData;
        } else {
            return { date: today, steps: 0, water: 0, sleep: 0, calories: 0, protein: 0 };
        }
    } catch (error) {
        console.error("Error fetching today's data:", error);
        return { date: today, steps: 0, water: 0, sleep: 0, calories: 0, protein: 0 };
    }
};

export const saveHealthData = async (data: HealthData) => {
    const uid = getUserId();
    if (!uid) return;

    const docRef = doc(db, 'users', uid, 'daily_logs', data.date);
    try {
        await setDoc(docRef, data, { merge: true });
    } catch (error) {
        console.error("Error saving health data:", error);
    }
};

export const getHealthHistory = async (): Promise<HealthData[]> => {
    const uid = getUserId();
    if (!uid) return [];

    try {
        const historyRef = collection(db, 'users', uid, 'daily_logs');
        const q = query(historyRef, orderBy('date', 'desc'), limit(30));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => doc.data() as HealthData);
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
};

export const saveUserProfile = async (profile: UserProfile) => {
    const uid = getUserId();
    if (!uid) return;

    const docRef = doc(db, 'users', uid);
    try {
        await setDoc(docRef, profile, { merge: true });
    } catch (error) {
        console.error("Error saving profile:", error);
    }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
    const uid = getUserId();
    if (!uid) return null;

    const docRef = doc(db, 'users', uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
    return null;
};
