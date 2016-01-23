export function search() {
  let button = document.querySelector('[href="#search"]');
  let results = document.querySelector('.js-search');
  let form = results.querySelector('form');
  let input = form.querySelector('input[type="search"]');

  let state = {
    active: false
  };

  button.addEventListener('click', () => {
    if (state.active) {
      hide();
    } else {
      show();
    }
  });

  results.addEventListener('click', (event) => {
    if (event.target == results) {
      hide()
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  function show() {
    button.classList.add('active');
    results.classList.add('active');
    document.body.style.overflow = 'hidden';
    state.active = true;
    setTimeout(focus, 3000);
  }

  function hide() {
    button.classList.remove('active');
    results.classList.remove('active');
    document.body.style.overflow = 'auto';
    state.active = false;
  }

  function focus() {
    input.focus();
  }
}