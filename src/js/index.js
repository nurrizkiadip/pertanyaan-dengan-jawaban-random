import axios from 'axios';

const CONFIG = {
  BASE_URL: 'https://yesno.wtf/api',
  BASE_URL_WITH_FORCED: (forcedValue) => `https://yesno.wtf/api?force=${forcedValue}`,
};

const initPages = () => {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');

  const headerHeight = header?.clientHeight || 0;
  const footerHeight = footer?.clientHeight || 0;

  main.style.minHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;
};

window.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('#questionForm');
  const forcedAnswerCheckbox = document.querySelector('#forcedAnswerCheckbox');
  const forcedAnswerContainer = document.querySelector('#forcedAnswerContainer');
  const forcedAnswerRadios = document.querySelectorAll('input[name="forcedAnswer"]');
  const textAnswer = document.querySelector('#textAnswer');

  function getCheckedRadios(radioElements) {
    return [...radioElements].filter((item) => item.checked)[0];
  }

  function setLoading(element) {
    element.textContent = 'Loading...';
  }

  function isQuestionInputValid() {
    const input = document.querySelector('#questionInput');

    if (!input.value) {
      window.alert('Masukkan pertanyaan terlebih dulu');
      return false;
    }
    if (!input.value.endsWith('?')) {
      window.alert('Akhirkan pertanyaan Anda dengan tanda tanya (?)');
      return false;
    }

    return true;
  }

  function translateAnswerToIndonesian(response) {
    const answer = response.data.answer.toLowerCase();

    if (answer === 'yes') return 'Ya';
    else if (answer === 'no') return 'Tidak';
    else return 'Mungkin';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!isQuestionInputValid()) {
      return;
    }

    const checkedForcedAnswerRadio = getCheckedRadios(forcedAnswerRadios);
    let endpoint = CONFIG.BASE_URL;
    if (checkedForcedAnswerRadio) {
      endpoint = CONFIG['BASE_URL_WITH_FORCED'](checkedForcedAnswerRadio.value);
    }

    setLoading(textAnswer);
    const response = await axios(endpoint);
    textAnswer.textContent = translateAnswerToIndonesian(response);
  });

  forcedAnswerCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      forcedAnswerContainer.style.display = 'block';
    } else {
      forcedAnswerContainer.style.display = 'none';
      getCheckedRadios(forcedAnswerRadios).checked = false;
    }
  });

  initPages();
});
