
import { collection, addDoc } from "firebase/firestore";
import {db} from '../configs/firebase'
import {dbConfig} from '../configs/config'

export const pushToFirestore = async (payload) => {
    try {
        const docRef = await addDoc(collection(db, dbConfig.collectionPath), payload);
        console.log("Document written with ID: ", docRef.id);
        return Promise.resolve(docRef.id);  // Resolve with the document ID
    } catch (e) {
        console.error("Error adding document: ", e);
        return Promise.reject(e);  // Reject with the error
    }
}