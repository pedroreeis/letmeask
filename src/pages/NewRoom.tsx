import { useAuth } from '../hooks/useAuth';
import { FormEvent, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';

import { PageLoading } from "../components/PageLoading";
import { Button } from '../components/Button'
import { database } from '../services/firebase';

import '../styles/auth.scss';
import { useTheme } from '../hooks/useTheme';

export function NewRoom() {
   const { user } = useAuth()
   const history = useHistory();

  const [newRoom, setNewRoom] = useState('');

  const { theme } = useTheme();

  useEffect(() => {
		if (user === null) {
			toast.success("Usuário não autenticado!");
			history.push("/");
		}
	}, [history, user]);

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();


    if (newRoom.trim() === '') {
      return
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/admin/rooms/${firebaseRoom.key}`)

    toast.success("Você criou uma sala!");
  }

	if (user === undefined) {
		return <PageLoading />;
	}
  
  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas." />
        <strong> Toda pergunta tem uma resposta. </strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
      <Toaster />
        <div className={"main-content"}>
          <img src={logoImg} alt="Logomarca da letmeask" />
          <h2 className={theme}>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
             type="text"
             placeholder="Nome da sala"
             onChange={event => setNewRoom(event.target.value)}
             value={newRoom}
             className={theme}
            />
            <Button type="submit">
             Criar sala
            </Button>     
          </form>
          <p className={theme}>
            Quer entrar em uma sala já existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}