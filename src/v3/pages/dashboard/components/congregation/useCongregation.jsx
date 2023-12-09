const useCongregation = () => {
  const handleSyncData = async () => {
    const svgIcon = document.querySelector('#organized-icon-synced');
    const g = svgIcon.querySelector('g');

    const checkMark = g.querySelector('path');
    checkMark.style.animation = 'fade-out 0s ease-in-out forwards';

    svgIcon.style.animation = 'rotate 2s linear infinite';

    setTimeout(() => {
      svgIcon.style.animation = '';
      checkMark.style.animation = 'fade-in 0.25s ease-in-out forwards';
    }, 3000);
  };

  return { handleSyncData };
};

export default useCongregation;
