import { useViewportSize } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen'


declare global {
  interface Window {
    api?: any;
  }
}

async function getCurrentInfo(token:string) {
  return await fetch('https://api.spotify.com/v1/me/player', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

async function refreshAccessToken(refresh: string) {
  const response = await fetch(`${import.meta.env.VITE_API}/refresh?refresh_token=${refresh}`)
  const json = await response.json()
  return json
}


function App() {
  const { height, width } = useViewportSize();
  const [imgSrc, setImgSrc] = useState('');
  const [error, setError] = useState('');
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      const url = new URL(window.location.href);
      const accToken = url.searchParams.get('access_token');
      const refToken = url.searchParams.get('refresh_token');
      if (accToken && refToken) {
        setCredentialsLoaded(true);
        getAlbumSrc(accToken, refToken).then(res => setImgSrc(res));
      }
    }, 1000)
    return () => clearInterval(interval);
  }, [])


  async function getAlbumSrc(access: string, refresh: string) {
    let currentInfo = await getCurrentInfo(access)
    console.log('status: ', currentInfo.status)

    if (false) {}
    else {
      if (currentInfo.status == 401) {
        refreshAccessToken(refresh)
          .then(res => {
            const newAccess = res.access_token
            const url = new URL(window.location.href);
            url.searchParams.set('access_token', newAccess);
            url.searchParams.set('refresh_token', refresh);
            window.history.pushState({}, '', url);
            return newAccess
          }).then((newAccess) => getCurrentInfo(newAccess))
      } 
      const jsonInfo = await currentInfo.json()
      const imgSrc = jsonInfo.item.album.images[0].url
      return imgSrc
    }
  }

  if(!credentialsLoaded) return <LoginScreen />;
  return (
    <div className="App"> 
        <div>
        {imgSrc ?
          <img draggable="false" className="window-drag mx-auto" height={height} width={width} src={imgSrc} alt="" />
          : <p className='m-auto text-center text-2xl'>{error}</p> }
        </div>
    </div>
  )
}

export default App
