const useInvitationCode = (code: string) => {
  const isShareSupported = 'share' in navigator;

  const handleShareCode = async () => {
    await navigator.share({ text: code });
  };

  return { isShareSupported, handleShareCode };
};

export default useInvitationCode;
