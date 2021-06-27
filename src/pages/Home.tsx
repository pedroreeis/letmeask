import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import githubIconImg from '../assets/images/github-icon.svg';

import toast, { Toaster } from 'react-hot-toast';
import { PageLoading } from '../components/PageLoading';

import { Button } from '../components/Button'
import { SignOut } from '../components/SignOut';
import { ThemeSelector }  from '../components/ThemeSelector'

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle, signInWithGithub } = useAuth()
  const [roomCode, setRoomCode] = useState('');

  const { theme } = useTheme();

  async function handleCreateRoom() {
    history.push('/rooms/new');
  }

  async function handleCreateRoomGoogle() {
    if(!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new');

    toast.success("Você logou com sucesso!");
  }

  async function handleCreateRoomGithub() {
    if(!user) {
      await signInWithGithub()
    }

    history.push('/rooms/new');

    toast.success("Você logou com sucesso!");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error("Esta sala não existe!");
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error("Esta sala está encerrada!");
      return;
    }

    history.push(`/rooms/${roomCode}`)

    toast.success("Você entrou em uma sala!");
  }

  if (user === undefined) {
		return <PageLoading />;
	}
  
  return (
    <div id="page-auth" className={theme}>
      <header>
        <ThemeSelector />
        <SignOut />
      </header>

      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas." />
        <strong> Toda pergunta tem uma resposta. </strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
      <Toaster />
        <div className="main-content">
          <img src={logoImg} alt="Logomarca da letmeask" />
          { user ? (
          <>
          <button onClick={handleCreateRoom} className="create-room btn1">
          Crie sua sala
          </button>

          <div className="separator">ou entre em uma sala</div>
          </>
          ) : (
          <>
          <button onClick={handleCreateRoomGoogle} className="create-room google">
          <img src={googleIconImg} alt="Logo do google" />
          Crie sua sala com a Google
          </button>

          <button onClick={handleCreateRoomGithub} className="create-room github">
          <img src={githubIconImg} alt="Logo do github" />
          Crie sua sala com o Github
          </button>
          <div className="separator">ou entre em uma sala</div>
          </>
          )}
        
          <form onSubmit={handleJoinRoom}>
            <input 
             type="text"
             placeholder="Digite o código da sala"
             onChange={event => setRoomCode(event.target.value)}
             value={roomCode}
             className={theme}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}