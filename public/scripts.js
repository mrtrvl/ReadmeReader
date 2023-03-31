/* eslint-disable no-unused-vars */
function toggleReadmeContent(element) {
  const arrow = element.querySelector('.arrow');
  const content = element.nextElementSibling;
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
  arrow.classList.toggle('arrow-closed');
  arrow.classList.toggle('arrow-open');
}

function revealAll() {
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
}

function hideAll() {
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
}
