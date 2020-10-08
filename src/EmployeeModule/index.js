class EmployeeModule {

    constructor() {
        this.empData = [];
    }

    getEmployees()  {
        return fetch('https://my-json-server.typicode.com/darshanp40/employeedb/employees').then((data) => {
            this.empData = data[0];
            return data;
        }).catch(() => {
            throw new Error('Some error occurred while fetching employees');
        })
    }
    updateEmployeeData(id) {

    }
    deleteEmployee(id) {

    }
    createEmployee() {

    }
}
export default EmployeeModule;