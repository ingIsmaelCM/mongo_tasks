const url = 'http://192.168.0.247:3000/subtasks'; // URL de ejemplo

const fetchData = async () => {
  const data = await fetch(url)
    .then(response => {
      const contentLength = response.headers.get('Content-Length');
      const totalSize = parseInt(contentLength, 10);
      let bytesReceived = 0;
      console.log(totalSize)
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          const push = async () => {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            
            bytesReceived += value.length;
            console.log(`Progreso: ${(bytesReceived / totalSize * 100).toFixed(2)}%`);
            controller.enqueue(value);
            push();
          };
          
          push();
        }
      });

      return new Response(stream);
    })
    .then(response => {
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          const push = async () => {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }

            controller.enqueue(value);
            push();
          };

          push();
        }
      });

      return new Response(stream);
    })
    .then(async (response) => response.blob())
    .catch(err => console.log('Error: ', err));
    console.log(data)
};

export default fetchData;
