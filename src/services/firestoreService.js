import { rtdb } from '../firebase/config';
import {
  ref,
  push,
  set,
  get,
  remove,
  query,
  orderByChild,
  serverTimestamp,
} from 'firebase/database';

/**
 * Save a FLAMES result to Realtime Database under users/{userId}/history
 */
export const saveResult = async (userId, data) => {
  try {
    const name1 = (data?.name1 || data?.firstPerson || '').trim();
    const name2 = (data?.name2 || data?.secondPerson || '').trim();
    const result = (data?.result || '').trim();

    if (!userId || !name1 || !name2 || !result) {
      throw new Error('Missing required fields for saveResult');
    }

    const historyRef = ref(rtdb, `users/${userId}/history`);
    const newHistoryRef = push(historyRef);

    // Generate human-readable date/time
    const now = new Date();
    const humanReadableTime = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    await set(newHistoryRef, {
      name1,
      name2,
      firstPerson: name1,
      secondPerson: name2,
      result,
      timestamp: serverTimestamp(),
      humanReadableTime,
    });

    return true;
  } catch (error) {
    console.error('Error saving result to Realtime Database:', error);
    return false;
  }
};

// Backward-compatible export for existing imports.
export const saveResultToFirestore = saveResult;

/**
 * Get all FLAMES history for a user, ordered by timestamp (newest first)
 */
export const getHistoryFromFirestore = async (userId) => {
  try {
    const historyRef = query(ref(rtdb, `users/${userId}/history`), orderByChild('timestamp'));
    const snapshot = await get(historyRef);

    if (!snapshot.exists()) return [];

    const raw = snapshot.val();
    const rows = Object.entries(raw).map(([id, value]) => {
      const normalizedName1 = value.name1 || value.firstPerson || '';
      const normalizedName2 = value.name2 || value.secondPerson || '';
      
      // Use human-readable time if available, otherwise format from server timestamp
      let displayTimestamp = value.humanReadableTime;
      if (!displayTimestamp && typeof value.timestamp === 'number') {
        const d = new Date(value.timestamp);
        displayTimestamp = d.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
      }

      return {
        id,
        ...value,
        name1: normalizedName1,
        name2: normalizedName2,
        timestamp: displayTimestamp || 'unknown',
      };
    });

    return rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error getting history from Realtime Database:', error);
    return [];
  }
};

/**
 * Delete a single history item from Realtime Database
 */
export const deleteHistoryItem = async (userId, docId) => {
  try {
    const historyItemRef = ref(rtdb, `users/${userId}/history/${docId}`);
    await remove(historyItemRef);
    return true;
  } catch (error) {
    console.error('Error deleting history item:', error);
    return false;
  }
};

/**
 * Clear all history for a user
 */
export const clearHistoryFromFirestore = async (userId) => {
  try {
    const historyRef = ref(rtdb, `users/${userId}/history`);
    await remove(historyRef);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};
