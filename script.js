const themeToggle = document.querySelector('#theme-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const menuLinks = document.querySelector('#menu-links');
const body = document.body;

const projectFilters = document.querySelector('#project-filters');
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const techFilter = document.querySelector('#tech-filter');
const roleFilter = document.querySelector('#role-filter');
const blogFilters = document.querySelector('#blog-filters');
const blogCards = Array.from(document.querySelectorAll('.blog-card'));

const projectModal = document.querySelector('#project-modal');
const postModal = document.querySelector('#post-modal');

const detailsButtons = document.querySelectorAll('.details-trigger');
const modalTitle = document.querySelector('#modal-title');
const modalText = document.querySelector('#modal-text');
const closeProjectModal = document.querySelector('#close-project-modal');

const postTriggers = document.querySelectorAll('.post-trigger');
const postContent = document.querySelector('#post-content');
const closePostModal = document.querySelector('#close-post-modal');

const contactForm = document.querySelector('#contact-form');
const formSuccess = document.querySelector('#form-success');

const commentForm = document.querySelector('#comment-form');
const commentName = document.querySelector('#comment-name');
const commentText = document.querySelector('#comment-text');
const commentList = document.querySelector('#comment-list');

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeToggle.innerHTML = '&#9728;';
} else {
  themeToggle.innerHTML = '&#9790;';
}

menuToggle?.addEventListener('click', () => {
  const opened = menuLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});

menuLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark');
  const darkMode = body.classList.contains('dark');
  themeToggle.innerHTML = darkMode ? '&#9728;' : '&#9790;';
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
});

function setupChipGroup(container, selector, handler) {
  container?.addEventListener('click', (event) => {
    const button = event.target.closest(selector);
    if (!button) return;

    container.querySelectorAll(selector).forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    handler(button);
  });
}

function applyProjectFilters() {
  const category = projectFilters?.querySelector('.chip.active')?.dataset.filter || 'all';
  const technology = techFilter?.value || 'all';
  const role = roleFilter?.value || 'all';

  projectCards.forEach((card) => {
    const categoryMatch = category === 'all' || card.dataset.category === category;
    const techMatch = technology === 'all' || card.dataset.tech.includes(technology);
    const roleMatch = role === 'all' || card.dataset.role === role;
    const visible = categoryMatch && techMatch && roleMatch;
    card.style.display = visible ? 'block' : 'none';
  });
}

setupChipGroup(projectFilters, '.chip', () => {
  applyProjectFilters();
});

techFilter?.addEventListener('change', applyProjectFilters);
roleFilter?.addEventListener('change', applyProjectFilters);

applyProjectFilters();

setupChipGroup(blogFilters, '.chip', (button) => {
  const filter = button.dataset.blog;
  blogCards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.style.display = visible ? 'block' : 'none';
  });
});

detailsButtons.forEach((image, index) => {
  image.addEventListener('click', () => {
    const card = image.closest('.project-card');
    const modalTitles = ['Find Your Next Opportunity', 'Empowering Youth & Teenage Mothers', 'Job Search For Rwandan Youth'];
    modalTitle.textContent = modalTitles[index] || 'Project details';
    modalText.textContent = `Category: ${card.dataset.category}. Technology: ${card.dataset.tech}. Role: ${card.dataset.role}.`;
    projectModal.showModal();
  });
});

closeProjectModal?.addEventListener('click', () => projectModal.close());

postTriggers.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.blog-card');
    const template = card.querySelector('template');
    postContent.innerHTML = template.innerHTML;
    postModal.showModal();
  });
});

closePostModal?.addEventListener('click', () => postModal.close());

projectModal?.addEventListener('click', (event) => {
  if (event.target === projectModal) projectModal.close();
});

postModal?.addEventListener('click', (event) => {
  if (event.target === postModal) postModal.close();
});

function setFieldError(field, message) {
  const errorNode = document.querySelector(`#${field.id}-error`);
  errorNode.textContent = message;
}

function validateContactForm() {
  let valid = true;
  const name = contactForm.name;
  const email = contactForm.email;
  const message = contactForm.message;

  setFieldError(name, '');
  setFieldError(email, '');
  setFieldError(message, '');

  if (name.value.trim().length < 2) {
    setFieldError(name, 'Please enter at least 2 characters.');
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    setFieldError(email, 'Please enter a valid email address.');
    valid = false;
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, 'Message should be at least 10 characters.');
    valid = false;
  }

  return valid;
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateContactForm()) return;

  formSuccess.textContent = 'Thanks! Your message has been sent successfully.';
  contactForm.reset();
});

commentForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = commentName.value.trim();
  const text = commentText.value.trim();
  if (!name || !text) return;

  const listItem = document.createElement('li');
  listItem.innerHTML = `<strong>${name}</strong>: ${text}`;
  commentList.prepend(listItem);

  commentForm.reset();
});
