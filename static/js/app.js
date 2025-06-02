async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const webcam = document.getElementById('webcam');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        webcam.srcObject = stream;
        webcam.onloadedmetadata = () => {
          resolve(webcam);
        };
      })
      .catch(err => {
        alert("Error accessing webcam: " + err.message);
        reject(err);
      });
  });
}

async function run() {
  const webcam = await setupWebcam();
  const model = await cocoSsd.load();
  console.log("Model loaded.");

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = webcam.videoWidth || 640;
  canvas.height = webcam.videoHeight || 480;

  async function detectFrame() {
    const predictions = await model.detect(webcam);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.font = "18px Arial";
      ctx.fillStyle = '#00FF00';

      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();

      ctx.fillText(
        `${prediction.class} ${(prediction.score * 100).toFixed(1)}%`,
        x,
        y > 10 ? y - 5 : 10
      );
    });

    requestAnimationFrame(detectFrame);
  }

  detectFrame();
}

run();
