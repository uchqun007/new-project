import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'src/firebase';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export const useAuth = () => {
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [user, setUser] = useState<null | User>(null);

	const router = useRouter();

	const signUp = async (email: string, password: string) => {
		setIsloading(true);

		await createUserWithEmailAndPassword(auth, email, password)
			.then(res => {
				setUser(res.user);
				router.push('/');
				fetch('/api/customer', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: res.user.email, user_id: res.user.uid }),
				});
				Cookies.set('user_id', res.user.uid);
				setIsloading(true);
			})
			.catch(error => setError(error.message))
			.finally(() => setIsloading(false));
	};

	const signIn = async (email: string, password: string) => {
		setIsloading(true);

		await signInWithEmailAndPassword(auth, email, password)
			.then(res => {
				setUser(res.user);
				router.push('/');
				Cookies.set('user_id', res.user.uid);
				setIsloading(true);
			})
			.catch(error => setError(error.message))
			.finally(() => setIsloading(false));
	};

	const logout = async () => {
		setIsloading(true);

		await signOut(auth)
			.then(() => {
				setUser(null);
				Cookies.remove('user_id');
			})
			.catch(error => setError(error.message))
			.finally(() => setIsloading(false));
	};

	return { error, isLoading, user, signIn, signUp, logout, setUser, setIsloading };
};
