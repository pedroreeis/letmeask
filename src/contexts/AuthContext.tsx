import { createContext, ReactNode, useState, useEffect } from 'react'
import { firebase, auth } from '../services/firebase'
import { toast } from "react-hot-toast";

type User = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: User | undefined | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User | null>();

  useEffect(()  => {
   const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if(!displayName || !photoURL ) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

      if(result.user) {
        const { displayName, photoURL, uid } = result.user

        if(!displayName || !photoURL ) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
  }

  const signOut = async () => {
		const signOutConfirm = window.confirm("Tem certeza que deseja deslogar?");

		if (signOutConfirm) {
			try {
				await auth.signOut();

				toast.success("Deslogado com sucesso!");
			} catch (error) {
				toast.error(error.message);
			}
		}
	};

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}