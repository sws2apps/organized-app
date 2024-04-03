import { handleUpdateSetting } from '@services/dexie/settings';

export const saveProfilePic = async (url: string, provider: string) => {
  if (url && url !== '' && url !== null) {
    if (provider !== 'microsoft.com' && provider !== 'yahoo.com') {
      const downloadedImg = new Image();
      downloadedImg.crossOrigin = 'Anonymous';

      const imageReceived = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = downloadedImg.width;
        canvas.height = downloadedImg.height;
        canvas.innerText = downloadedImg.alt;

        context.drawImage(downloadedImg, 0, 0);

        canvas.toBlob((done) => savePic(done));

        // Remove the event listener to avoid memory leak
        downloadedImg.removeEventListener('load', imageReceived, false);
      };

      downloadedImg.src = url;
      downloadedImg.addEventListener('load', imageReceived, false);

      const savePic = (profileBlob) => {
        profileBlob.arrayBuffer().then((profileBuffer) => {
          handleUpdateSetting({ user_avatar: profileBuffer });
        });
      };

      return;
    }
  }

  await handleUpdateSetting({ user_avatar: undefined });
};
