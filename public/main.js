const USER_ID =
    Math.random().toString(36).replace('0.', 'some_id') + // генерируем уникальный id для каждого пользователя
    Math.random().toString(36).replace('0.', '') +
    Math.random().toString(36).replace('0.', '') +
    Math.random().toString(36).replace('0.', '');

async function getMessage() {
    while (true) {
        await fetch('/api/v1/message')
            .then((e) => e.json())
            .then((data) => {
                const messageWrapper = document.createElement('div');
                messageWrapper.className = 'message-wrapper';
                if (data.USER_ID === USER_ID) {
                    messageWrapper.setAttribute('isMy', true)
                }
                if (data.type === 'img') {
                    messageWrapper.innerHTML = `<img src='${data.body}'>`
                } else {
                    messageWrapper.innerHTML = `<p>${data.body}</p>`
                }

                chat.appendChild(messageWrapper);
                chat.scrollTo(0, 10000000000000000); // scroll to see the last message
            })
            .catch((e) => console.log(e))  // if it will be error
    }
}
getMessage();

function sendMessage(text, type = 'text') {                // ф-ция для отправки сообщений
    fetch('/api/v1/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            USER_ID, // USER_ID:USER_ID or just USER_ID
            type,  // type: type or just type
            body: text,
        }),
    }).catch((e) => console.log(e))  // if it will be error
}

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    sendMessage(e.target['text'].value) //значение input
    e.target['text'].value = '';
})

document.body.addEventListener('dragover', (event) => {
    event.preventDefault();
});
document.body.addEventListener('drop', (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
        const type = event.dataTransfer.files[0].type.toLowerCase();
        if (type.includes('jpg') || type.includes('png') || type.includes('jpeg')) {
            const reader = new FileReader();
            reader.onload = function () {
                sendMessage(reader.result, 'img')
            }
            reader.readAsDataURL(event.dataTransfer.files[0]);
            return;
        }
    }
    alert('Bad file');
})

