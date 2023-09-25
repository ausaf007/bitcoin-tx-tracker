
import { collection, addDoc } from "firebase/firestore";
import {db} from '../configs/firebase'
import {dbConfig} from '../configs/config'

export const saveToFirestore = async (payload) => {
    try {
        const docRef = await addDoc(collection(db, dbConfig.collectionPath), payload);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}