/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
const toggleContent = (element) => {
  const arrow = element.querySelector('.arrow');
  const content = element.nextElementSibling;
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
  arrow.classList.toggle('arrow-closed');
  arrow.classList.toggle('arrow-open');
};

const revealAll = () => {
  const headers = document.querySelectorAll('h2');
  headers.forEach((header) => {
    const arrow = header.querySelector('.arrow');
    const content = header.nextElementSibling;

    if (content.style.display === 'none') {
      content.style.display = 'block';
      arrow.classList.remove('arrow-closed');
      arrow.classList.add('arrow-open');
    }
  });
};

const hideAll = () => {
  const headers = document.querySelectorAll('h2');
  headers.forEach((header) => {
    const arrow = header.querySelector('.arrow');
    const content = header.nextElementSibling;

    if (content.style.display === 'block') {
      content.style.display = 'none';
      arrow.classList.remove('arrow-open');
      arrow.classList.add('arrow-closed');
    }
  });
};

const navLinks = document.querySelectorAll('[data-loading]');
const loadingIndicator = document.getElementById('loadingIndicator');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetUrl = event.target.href;

    if (targetUrl) {
      loadingIndicator.style.display = 'block';
      window.location.href = targetUrl;
    }
  });
});
