import EmployeeModule from '../EmployeeModule/index.js';

// AppController becomes the interface to interact with the server data
class CrudFacade {

    constructor(type) {
        this.type = type;

    }

    tryToReturn(func) {
        const result = func.call(this);
        return result.then((data) => {
            if(data.ok) {
                return data.json();
            } else {
                return Promise.reject(new Error('error'));
            }
        }).catch(e => Promise.reject('e'));
    }

    employees() {
        this.employeeInterface = new EmployeeModule();
        Object.freeze(this.employeeInterface);
        return {
            fetch: this.employeeInterface.getEmployees,
            update: this.employeeInterface.updateEmployeeData,
            delete:  this.employeeInterface.deleteEmployee,
            create: this.employeeInterface.createEmployee
        }
    }

    create() {
        switch(this.type) {
            case 'EMPLOYEE': {
                return this.tryToReturn(this.employees().create);
            }
            default: {
                return Promise.reject('Some error');
            }
        }
    }
    get() {
        switch(this.type) {
            case 'EMPLOYEE': {
                return this.tryToReturn(this.employees().fetch);
            }
            default: {
                return Promise.reject('Some error');
            }
        }
    }

}
export default CrudFacade;