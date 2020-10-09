class Options extends HTMLElement {
    constructor() {
        super();
        this.validForm = true;
     
    }
    connectedCallback() {
        this._render();
        this._attachEventHandlers();
        
    }
   
    get title() {
        return this.getAttribute("title");
      }
    get empid() {
      return this.getAttribute("empid");
    }
    set empid(id) {
      this.setAttribute("empid", id);
    }
    set title(value) {
        this.setAttribute("title", value);
    }
    get visible() {
        return this.hasAttribute("visible");
    }
    set visible(value) {
        if (value) {
            this.setAttribute("visible", "");
        } else {
            this.removeAttribute("visible");
        }
    }
    static get observedAttributes() {
        return ["visible", "title", "empid"];
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title" && this.shadowRoot) {
          this.shadowRoot.querySelector(".title").textContent = newValue;
        }
        if (name === "visible" && this.shadowRoot) {
          if (newValue === null) {
            this.shadowRoot.querySelector(".wrapper").classList.remove("visible");
          } else {
            this.shadowRoot.querySelector(".wrapper").classList.add("visible");
          }
        }
        if(name === "empid" && this.shadowRoot) {
          if(newValue) {
            this.userId = newValue;
          }
        }
      }
      _attachEventHandlers() {
        const updateButton = this.shadowRoot.querySelector(".update");
        const readButton = this.shadowRoot.querySelector(".read");
        const deleteButton = this.shadowRoot.querySelector(".delete");



        updateButton.addEventListener('click', e => {
          // TODO - invoke "cancel event"
          this.dispatchEvent(new CustomEvent("update", {
            detail: this.empid
          }));
          this.removeAttribute("visible");
        });
        deleteButton.addEventListener('click', e => {
            // TODO - invoke "cancel event"
            this.dispatchEvent(new CustomEvent("delete", {
              detail: this.empid
            }));
            this.removeAttribute("visible");
        });
        readButton.addEventListener('click', e => {
            console.log(this.empid);
            // TODO - invoke "cancel event"
            this.dispatchEvent(new CustomEvent("read", {
              detail: this.empid
            }));
            this.removeAttribute("visible");
        });
      }
    _render() {
        
        const container = document.createElement("div");
        const wrapperClass = this.visible ? "wrapper visible" : "wrapper";
        container.innerHTML = `
          <style>
            .wrapper {
              position: absolute;
              opacity: 0;
              visibility: hidden;
              z-index: 1;
              border: 1px solid black;
            }
           
            .visible {
              opacity: 1;
              visibility: visible;
            }
            .modal {
              background-color: #fff;
              color: black;
            }
            ul {
                list-style-type: none;
                padding:0;
                margin: 0;
                text-align: left;
                min-width: 60px;
            }
            li {
              padding:10px;
            }
            li:hover {
              background-color: #f5f5f5; 
            }
            
            
          </style>
          <div class='${wrapperClass}'>
            <div class='modal'>
              <div class='content'>
                <ul>
                    <li class="read">Read</li>
                    <li class="update">Update</li>
                    <li class="delete">Delete</li>
                </ul>
              </div>
            </div>
          </div>`;
    
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(container);
      }
}

window.customElements.define("options-modal", Options);