import compile from './compile';
import hljs from '../../hljs';

var input = document.querySelector('.source');
var output = document.querySelector('.output');

input.addEventListener('keyup', (event) => {
  try {
    let code = compile(input.value);
    output.innerHTML = hljs.highlight('lisp', code).value;
  } catch (e) {
    output.innerHTML = e;
  }
});
