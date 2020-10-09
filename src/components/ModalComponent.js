class Modal extends HTMLElement {
    constructor() {
        super();
        this.validForm = true;
        this.data = {};
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

    get mode() {
      return this.getAttribute("mode");
    }
    set mode(mode) {
      this.setAttribute("mode", mode);
    }

    get empdata() {
      return this.getAttribute("empdata");
    }
    set empdata(empdata) {
      this.setAttribute("empdata", empdata);
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
        return ["visible", "title", "empid", "empdata", "mode"];
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
            this.shadowRoot.querySelector(".error-message").classList.remove('visible');
          }
        }
        if(name === "empid" && this.shadowRoot) {
          if(newValue) {
            this.shadowRoot.querySelector("#emp-id").innerHTML = newValue;
          }
        }
        if(name === "empdata" && this.shadowRoot) {
          if(newValue) {
            console.log('ne value is ---', newValue);
            const empData = JSON.parse(newValue);
            for(let prop in empData) {
              if (empData.hasOwnProperty(prop)) {
                const formFields = [...this.shadowRoot.querySelectorAll('.create-form-field')];
                formFields.forEach((input) => {
                  const inputName = input.name;
                  input.value = empData[inputName];
                  if(inputName === 'firstName' || inputName === 'lastName') {
                    input.value = empData.preferredFullName;
                  } 
                })
              }
            }
          }
        }
        if(name === "mode" && this.shadowRoot) {
          if(newValue) {
            if (newValue === 'read') {
              const formFields = [...this.shadowRoot.querySelectorAll('.create-form-field')];
              formFields.forEach((input) => {
                
                  console.log('in this block');
                  input.readOnly = true;
                
              })
            }
            if (newValue === 'create') {
              const formFields = [...this.shadowRoot.querySelectorAll('.create-form-field')];
              formFields.forEach((input) => {
                  input.value = '';
                
              })
            }
          }
        }
      }
      _attachEventHandlers() {
        const cancelButton = this.shadowRoot.querySelector(".cancel");
        cancelButton.addEventListener('click', e => {
          // TODO - invoke "cancel event"
          this.dispatchEvent(new CustomEvent("cancel"))
          this.removeAttribute("visible");
          this.removeAttribute("visible");
        });
        const okButton = this.shadowRoot.querySelector(".ok");
        okButton.addEventListener('click', e => {
          // TODO - invoke "ok event"
          let validForm = true;
          // validate form
          const formFields = [...this.shadowRoot.querySelectorAll('.create-form-field')];
          const formData = {};
          formFields.forEach((input) => {
              formData[input.name] = input.value
              if(!input.value.length) {
                validForm = false;
              }
          })
          
          if (validForm) {
            formData.preferredFullName = `${formData.firstName} ${formData.lastName}`;
            formData.id = this.empid;
            delete formData.firstName;
            delete formData.lastName;
            // this.removeAttribute("visible");
            // this.removeAttribute("visible");
            console.log(formData);
            this.dispatchEvent(new CustomEvent("ok", {
              detail: {formData: formData, mode: this.mode}
            }));
            this.shadowRoot.querySelector(".error-message").classList.remove("visible");
            this.removeAttribute("visible");
            this.removeAttribute("visible");
          } else {
            
            this.shadowRoot.querySelector(".error-message").classList.add("visible");
          }
        });
      }
    _render() {
        
        const container = document.createElement("div");
        const wrapperClass = this.visible ? "wrapper visible" : "wrapper";
        container.innerHTML = `
          <style>
            .wrapper {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0,0,0,0.8);
              opacity: 0;
              visibility: hidden;
              transform: scale(1.1);
              transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
              z-index: 1;
            }
            .create-form-field:read-only {
              background-color: #f5f5f5;
              border: 1px solid #a9a9a9;
            }
            .form-row {
                display: flex;
                padding: 12px 0;
            }
            .form-row > div{
                flex: 1;
                padding: 0 8px; 
            
            }
            .form-row > div input  {
                width: 100%;
                margin-top: 6px;
                padding:6px;
            }
            
            .visible {
              opacity: 1;
              visibility: visible;
              transform: scale(1);
              transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
            }
            .modal {
              font-family: Helvetica;
              font-size: 14px;
              padding: 20px;
              background-color: #fff;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%,-50%);
              border-radius: 2px;
              min-width: 300px;
            }
            .title {
              font-size: 18px;
            }
            .button-container {
              text-align: right;
            }
            button {
              min-width: 80px;
              background-color: #848e97;
              border-color: #848e97;
              border-style: solid;
              border-radius: 2px;
              padding: 3px;
              color:white;
              cursor: pointer;
            }
            button:hover {
              background-color: #6c757d;
              border-color: #6c757d;
            }
            h2 {
                position: relative;
            }
            h2:after {
                position: absolute;
                width: calc(100% + 40px);
                height: 1px;
                background-color: #a9a9a9;
                display: block;
                content: '';
                left: -20px;
                top: calc(100% + 12px);
            }
            .error-message {
                color: red;
                margin: 12px 0;
                visibility: hidden;
                padding-left: 8px
            }
            .error-message.visible {
                visibility: visible;
            }
            .id-ctr {
              margin-left: 8px;
              border: 1px solid #a9a9a9;
              padding: 6px 12px;
              border-radius: 4px;
              display: inline-block;
              margin-top: 8px;
              
            }
            #emp-id {
              background-color: #f5f5f5;
            }
          </style>
          <div class='${wrapperClass}'>
            <div class='modal'>
              <h2 class='title'>${this.title}</h2>
              <label>Enployee ID</label>
              <span class="id-ctr">
                
                <span>EM</span><span id="emp-id">${this.empid}</span>
              </span>
              <div class='content'>
                <form>
                    <div class="form-row">
                        <div>
                            <label>First Name</label>
                            <input class="create-form-field" name="firstName" type="text" />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input class="create-form-field" name="lastName" type="text" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div>
                            <label>Job Title</label>
                            <input class="create-form-field" type="text" name="jobTitleName" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div>
                            <label>Employee Code</label>
                            <input class="create-form-field" type="text" name="employeeCode" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div>
                            <label>Email</label>
                            <input class="create-form-field" type="text" name="emailAddress" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div>
                            <label>Phone Number</label>
                            <input class="create-form-field" type="text" name="phoneNumber" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div>
                            <label>Region</label>
                            <input class="create-form-field" type="text" name="region" />
                        </div>
                        <div>
                            <label>DOB</label>
                            <input class="create-form-field" type="text" name="dob" />
                        </div>
                    </div>
                </form>
              </div>
              <p class="error-message"> Fields cannot be empty </p>
              <div class='button-container'>
                <button class='cancel'>Cancel</button>
                <button class='ok'>Okay</button>
              </div>
            </div>
          </div>`;
    
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(container);
      }
}

window.customElements.define("x-modal", Modal);