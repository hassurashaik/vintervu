import Webcam from 'react-webcam';

function WebcamFeed() {
  return (
    <div>
      <h3>Webcam Feed</h3>
      <Webcam audio={false} width="100%" height="auto" screenshotFormat="image/jpeg" />
    </div>
  );
}

export default WebcamFeed;