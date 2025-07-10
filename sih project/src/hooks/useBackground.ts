export const useBackground = () => {
  const justiceLogoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="flag-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FF671F"/>
          <stop offset="50%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#046A38"/>
        </linearGradient>
      </defs>
      <path fill="url(#flag-gradient)" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 1c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3 3v2H9V7h6zM7 11h10v2H7v-2zm3 4h4v2h-4v-2z"/>
    </svg>
  `;

  const backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(justiceLogoSvg)}")`;

  return {
    backgroundImage,
    backgroundSize: '60%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
    backgroundBlendMode: 'soft-light',
  };
};