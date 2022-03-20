const {
  contextBridge,
  ipcRenderer,
} = require("electron");

ipcRenderer.on('set-user-code', function (evt, data) {
  const extUrl = data.url;
  const splitUrl = extUrl.split('/');
  const accessToken = splitUrl[splitUrl.length-2];
  const refreshToken = splitUrl[splitUrl.length-1];

  const url = new URL(window.location);
  url.searchParams.set('access_token', accessToken);
  url.searchParams.set('refresh_token', refreshToken);
  window.history.pushState({}, '', url);


  // localStorage.setItem('userCode', code)
});

require('electron').ipcRenderer.on('sign-out', function() {
  const url = new URL(window.location);
  url.searchParams.set('access_token', '');
  url.searchParams.set('refresh_token', '');
  window.history.pushState({}, '', url);
});

contextBridge.exposeInMainWorld(
  "api", {
      resize: (data) => {
        ipcRenderer.send('resize-window', data);
      },
      browser: (url) => {
        require('electron').shell.openExternal(url);
      },
      getSystem: () => {
        return process.platform;
      }

  },
);
