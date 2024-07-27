const useNoSchedule = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return { handleReload };
};

export default useNoSchedule;
