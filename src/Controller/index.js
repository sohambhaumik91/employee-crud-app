import EmployeeModule from '../EmployeeModule/index.js';

// AppController becomes the interface to interact with the server data
class CrudFacade {

    constructor(type) {
        this.type = type;

    }

    tryToReturn(func, action) {
        const result = func.call(this);
        if(result.then) {
            return result.then((data) => {
                if(data.ok) {
                    return data.json();
                } else {
                    return Promise.reject(new Error('error'));
                }
            }).catch(e => Promise.reject(e.message));
        } else {
            return Promise.resolve([result]);
        }
        
    }

    employees() {
        this.employeeInterface = new EmployeeModule();
        // Object.freeze(this.employeeInterface);
        return {
            fetch: this.employeeInterface.getEmployees,
            update: this.employeeInterface.updateEmployeeData,
            delete:  this.employeeInterface.deleteEmployee,
            create: this.employeeInterface.createEmployee,
            getLastId: this.employeeInterface.getLastEmpId,
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
    save(data) {
        switch(this.type) {
            case 'EMPLOYEE': {
                return this.employeeInterface.employeeData = data;
            }
            default: {
                return Promise.reject('Some error');
            }
        }
    }

}
export default CrudFacade;