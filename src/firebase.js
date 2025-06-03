import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyC-y8Vuqo16K-_IfL14crF0ydhl85TxEpM",
	authDomain: "wedding-b8fb3.firebaseapp.com",
	databaseURL:
		"https://wedding-b8fb3-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "wedding-b8fb3",
	storageBucket: "wedding-b8fb3.firebasestorage.app",
	messagingSenderId: "610823348490",
	appId: "1:610823348490:web:595bcfa11444ddff51daf3",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
function writeUserData(userId, name, agreement, agreementDate) {
	set(ref(db, "users/" + userId), {
		username: name,
		agreement: agreement,
		date: agreementDate,
	});
}

const userId = localStorage.getItem("userUniqueId");
const userRef = ref(db, `users/${userId}`);

async function getUserData(userId) {
	const db = getDatabase(app);
	const snapshot = await get(userRef);
	return snapshot.exists() ? snapshot.val() : null;
}

export { writeUserData, getUserData };
