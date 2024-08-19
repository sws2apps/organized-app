const useInvitationCode = (code: string) => {
  const isShareSupported = navigator.share;

  const handleShareCode = async () => {
    await navigator.share({ text: code });
  };

  return { isShareSupported, handleShareCode };
};

export default useInvitationCode;
