import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MedicalRecord, MedicalRecordFormData } from '../types';

const COLLECTION_NAME = 'reports';

export const reportService = {
  async getAll(): Promise<MedicalRecord[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Ensure numbers are numbers and dates are handled
        id_numeric: parseInt(doc.id) || 0 // Hack for old code expecting number ID
      } as any;
    });
  },

  async create(data: MedicalRecordFormData): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string | number, data: MedicalRecordFormData): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    } as any);
  },

  async delete(id: string | number): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id.toString());
    await deleteDoc(docRef);
  }
};
