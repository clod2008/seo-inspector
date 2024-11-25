document.getElementById('fetchButton').addEventListener('click', async () => {
    const url = document.getElementById('urlInput').value;
    const resultElement = document.getElementById('result');

    if (!url) {
        resultElement.textContent = 'Please enter a URL.';
        return;
    }

    try {
        const response = await fetch(`/fetch-url?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        resultElement.textContent = JSON.stringify(data, null, 2);
        console.log(encodeURIComponent(url))
    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
});