import { useEffect, useRef } from 'react';

const KalturaVideoPlayer = ({ kalturaId, partnerId = '2371571', playerSize = { width: '100%', height: '400px' } }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!kalturaId || !playerRef.current) return;

    // Load Kaltura player library with dynamic partner ID
    const script = document.createElement('script');
    script.src = `https://cdnapisec.kaltura.com/p/${partnerId}/embedPlaykitJs/uiconf_id/47735130`;
    script.async = true;

    script.onload = () => {
      if (window.kalturaPlayer && playerRef.current) {
        const player = window.kalturaPlayer(playerRef.current);
        player.loadMedia({
          entryId: kalturaId,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [kalturaId, partnerId]);

  return (
    <div
      ref={playerRef}
      style={{
        width: playerSize.width,
        height: playerSize.height,
        backgroundColor: '#000',
        marginBottom: '20px'
      }}
      id={`kaltura-player-${kalturaId}`}
    />
  );
};

export default KalturaVideoPlayer;
