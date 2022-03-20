import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
//@ts-ignore
import { Bars } from 'svg-loaders-react';
// import { useSearchParams } from "react-router-dom";


declare global {
    interface Window {
      api?: any;
    }
}

const spotifySVG = (
    <svg className="inline-block mr-2 -ml-1 my-0.5" height={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
        aria-describedby="desc" role="img" >
        <path data-name="layer1"
        d="M32 0a32 32 0 1 0 32 32A31.966 31.966 0 0 0 32 0zm12.3 47.2a2.654 2.654 0 0 1-1.4-.5 32.041 32.041 0 0 0-16.6-4.3 48.082 48.082 0 0 0-10.1 1.1 11.045 11.045 0 0 1-1.6.3 2 2 0 0 1-2-2 2.11 2.11 0 0 1 1.7-2.2 53.9 53.9 0 0 1 12-1.4A35.787 35.787 0 0 1 44.9 43a2.131 2.131 0 0 1 1.3 2.1 1.846 1.846 0 0 1-1.9 2.1zm3.5-8.5a2.834 2.834 0 0 1-1.6-.6A41.422 41.422 0 0 0 25.9 33a43.3 43.3 0 0 0-10.4 1.3 4.707 4.707 0 0 1-1.6.4 2.476 2.476 0 0 1-2.5-2.5 2.6 2.6 0 0 1 2-2.7A43.762 43.762 0 0 1 26 27.7a44.707 44.707 0 0 1 22.8 5.9 2.583 2.583 0 0 1 1.5 2.5 2.5 2.5 0 0 1-2.5 2.6zm4-9.8a3.022 3.022 0 0 1-1.6-.5C44.3 24.9 35.3 23 26.7 23a49.826 49.826 0 0 0-12.8 1.5 9.005 9.005 0 0 1-1.6.3 3.031 3.031 0 0 1-3-3.1 3.213 3.213 0 0 1 2.2-3.1 55.906 55.906 0 0 1 15.2-2c9.4 0 19.3 1.9 26.5 6.2a3.025 3.025 0 0 1 1.6 2.9 3.058 3.058 0 0 1-3 3.2z"
        fill="#ffffff"></path>
    </svg>
)

export default function LoginScreen() {
    const [sessionId, setSessionId] = useState<string>();
    const [connecting, setConnecting] = useState(false);
    const [systemPlatform, setSystemPlatform] = useState<string>();

    useEffect(() => {
      if (!sessionId) setSessionId(nanoid());
      if (!systemPlatform) setSystemPlatform(getOs())
    }, [])

    function openExternalLogin() {
        setConnecting(true);
        if (window.api) {
            window.api.browser(`${import.meta.env.VITE_API}/login?sessionId=${sessionId}`);
        }
    }

    const getOs = () => {
        if(window.api) {
            return window.api.getSystem
        }
     }

    return (
        <div className="w-screen h-screen flex font-spacegrot">
            {systemPlatform != 'win32' &&
            <div className="fixed h-10 bg-green-400 w-screen flex window-drag align-middle">
                <p className="m-auto text-slate-600 font-light">tilee.io</p>
            </div>
            }
            <div className="bg-slate-100 text-slate-600 w-72 m-auto rounded-3xl  p-5">
                    <p className="m-auto text-center mb-5">
                        { !connecting ? 
                        'You must sign in to Spotify to use tilee'
                        : 'Waiting for credentials...'} </p>

                { !connecting ?
                    <button className="hover:opacity-90 w-full" onClick={ () => openExternalLogin() }>
                            <div className="text-white font-sans py-2 rounded-full uppercase w-full" 
                            style={{backgroundColor:'#1db954'}}>
                                {spotifySVG}
                                <p className='inline-block'>connect spotify</p>
                        </div>
                    </button>
                :
                    <div className="mx-auto w-fit">
                        <Bars fill="#1DB954" width={80}/>
                    </div>
                }
            </div>
        </div>
        
    )
}