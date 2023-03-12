
import Head from 'next/head'
import { Header, Hero } from 'src/components';
import { API_REQUEST } from './../services/api.services';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { IMove } from './../interfaces/app.interfaces';
import { Row } from 'src/components/row/row';
import { useContext } from 'react';
import { AuthContext } from './../context/auth.context';
import { useInfoStore } from 'src/store';
import { Modal } from './../components/modal/Modal';


export default function Home({trending, topRated, tvTopRated, popular ,playing, fantasy}: HomeProps):JSX.Element {
const {isLoading} = useContext(AuthContext)

if(isLoading) return <>{null}</>;

const {modal} = useInfoStore();
// const {isLoading} = useContext(AuthContext)

console.log(modal);


  return (
    <div className={`relative min-h-screen ${modal && "!h-screen overflow-hidden"}`}>
      <Head>
        <title>Home | Next</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Header />
      <main className='relative pl-4 pb-24 lg:space-y-24 lg:pl-16'>
      <Hero trending={trending} />
        <section>
            <Row title="Top Rated" movies={topRated} />
            <Row title="TV show" movies={tvTopRated} isBig={true} />
            <Row title="Popular" movies={popular} />
            <Row title="Fantasy" movies={fantasy} />
            <Row title="Playing" movies={playing.reverse()} />
        </section>
      </main>
      {modal && <Modal />}
    </div>  
  )
}


// SERVISE SITE RENDERING
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const [trending, topRated, tvTopRated, popular, playing, fantasy] = await Promise.all([
    fetch(API_REQUEST.trending).then(res => res.json()),
    fetch(API_REQUEST.top_rated).then(res => res.json()),
    fetch(API_REQUEST.tv_top_rated).then(res => res.json()),
    fetch(API_REQUEST.popular).then(res => res.json()),
    fetch(API_REQUEST.playing).then(res => res.json()),
    fetch(API_REQUEST.fantasy).then(res => res.json())
  ]);

  return{
    props:{
      trending: trending.results,
      topRated: topRated.results,
      tvTopRated: tvTopRated.results,
      popular: popular.results,
      playing: playing.results,
      fantasy: fantasy.results,
     
    }
  }
}

interface HomeProps {
  trending: IMove[],
  topRated: IMove[],
  tvTopRated: IMove[],
  popular: IMove[],
  fantasy: IMove[],
  playing: IMove[],
}