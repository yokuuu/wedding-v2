const API_URL = 'http://localhost:8888/submit';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userName = document.getElementById('userName').value.trim();
        const radio = form.querySelector('input[name="radio"]:checked')?.value;

        if (!userName || !radio) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append('userName', userName);
        formData.append('radio', radio);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            form.reset();
        } catch (error) {
            alert('Ошибка при отправке формы');
            console.error(error);
        }
    });
});
