export default class App {
  constructor() {
    this.render();
    this.initListeners();
    this.update();
  }

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <div>
        <h1>Hello from App component!</h1>
        <button>Click me!</button>

        <br>
        <br>
        <br>
        <div data-element="requestResult"></div>
      </div>
    `;

    this.element = wrapper.firstElementChild;
  }

  initListeners () {
    const btnElement = this.element.querySelector('button');

    btnElement.addEventListener('click', event => {
      console.error(event);
    });
  }

  async update () {
    const codeElement = this.element.querySelector('[data-element="requestResult"]');
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const json = await response.json();

    codeElement.innerHTML = JSON.stringify(json);
  }
}
