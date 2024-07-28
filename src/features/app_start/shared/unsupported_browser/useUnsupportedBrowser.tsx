const useUnsupportedBrowser = () => {
  const reloadApp = () => window.location.reload();

  return { reloadApp };
};

export default useUnsupportedBrowser;
