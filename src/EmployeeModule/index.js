class EmployeeModule {

    constructor() {
        this.empData = [];
    }

    getEmployees()  {
        if(localStorage.getItem('empData')) {
            console.log('local storage mp exists');
            return [...JSON.parse(localStorage.getItem('empData'))];

        }
        console.log('local storage mp exists not');
        return fetch('https://my-json-server.typicode.com/darshanp40/employeedb/employees').then((data) => {
            return data;
        }).catch((e) => {
            throw new Error(e.message);
        })
    }
    set employeeData(data) {
        this.empData = data;
    }
    get employeeData() {
        return this.empData;
    }
    updateEmployeeData(id) {

    }
    deleteEmployee(id) {

    }
    createEmployee() {

    }
    getLastEmpId() {
        
        return Promise.resolve(this.empData.slice(0).sort((a, b) => a.id - b.id)[this.empData.length-1].id);
    }
}
export default EmployeeModule;