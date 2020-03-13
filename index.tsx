let React = {

    createElement: (tag, props, ...children) => {
        
        if (typeof tag == 'function') {
            try {
                return tag(props);
            } catch({promise, key}) {
                promise.then(data => {
                    promiseCache.set(key, data);

                    rerender();
                });

                return { tag: "div", props: { children: ["I'm loading ..."] } };
            }
            
        }

        let element = {tag, props: {...props, children}};

        return element;
    },

};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
    const FRONZENCURSOR = stateCursor;
    states[FRONZENCURSOR] = states[FRONZENCURSOR] || initialState;
    let setState = (newState) => {
        states[FRONZENCURSOR] = newState;
        rerender();
    };
    stateCursor++;
    return [states[FRONZENCURSOR], setState];

};

const promiseCache  = new Map();

const createResource = (thingThatReturnLate, key) => {
    if (promiseCache.has(key)) {
        return promiseCache.get(key);
    }

    throw {promise: thingThatReturnLate(), key};

};

const App = () => {

    const [name, setName] = useState("person");
    const [count, setCount] = useState(0);
    const dogPhotoUrl = createResource(() => fetch("https://dog.ceo/api/breeds/image/random")
        .then(r => r.json())
        .then(payloan => payloan.message), "dogPhoto");

    return (
        <div className="react-2020">
        <h1>Hello, {name}!</h1> 
        <input value={name} onchange={e => setName(e.target.value)} type="text" placeholder="name" />
        <div>
        Counter {count} <button onclick={() => setCount(count+1)}>+</button> <button onclick={() => setCount(count-1)} >-</button>
        
        <img alt="Dog photo" src={dogPhotoUrl} />
        </div>
        <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        </p>
        </div>
    );
};

const appContainer = document.querySelector("#app");

const rerender = () => {
    stateCursor = 0;
    appContainer.firstChild.remove();
    render(<App />, appContainer);
};

const render = (reactElementOrStringOrNumber, container) => {

    if (['string', 'number'].includes(typeof reactElementOrStringOrNumber)) {
        container.appendChild(document.createTextNode(String(reactElementOrStringOrNumber)));
        return;
    }

    const actualDomElement = document.createElement(reactElementOrStringOrNumber.tag);

    if(reactElementOrStringOrNumber.props) {
        Object.keys(reactElementOrStringOrNumber.props).filter(p => p !== 'children').forEach( p => actualDomElement[p] = reactElementOrStringOrNumber.props[p]);
    }

    if(reactElementOrStringOrNumber.props.children) {
        reactElementOrStringOrNumber.props.children.forEach(child => render(child, actualDomElement));
    }

    container.appendChild(actualDomElement);
};

render(<App />, appContainer);