import CrudFacade from './Controller/index.js';
import TableModule from './TableModule/index.js';
import { EMPLOYEE_MODULE, tableBody, wrapper, tableHeader} from './constants.js';

const debounce= function(fn, delay) {
    let timeout;
    return function() {
        const ctx = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(ctx);
        }, delay)
    }
}

const empTable = new TableModule();
const empInterFace = new CrudFacade(EMPLOYEE_MODULE);

empInterFace.get().then((data) => {
    console.log(data);
    empTable.setTableData(data[0]);
    empTable.setDefaultFilters();
    localStorage.setItem('empData', JSON.stringify(data[0]));
    empInterFace.save(data[0]);
    tableBody.innerHTML = empTable.renderTable(empTable.tableData);

}).catch((e) => {
    console.log('error is ---', e.message);
});

wrapper.addEventListener('click', (e) => {
    if(event.target.nodeName.toLowerCase() === 'button') {
        empTable.clickFn()
    }
});

tableHeader.addEventListener('click', (event) => {
    if(event.target.nodeName === 'TH') {
        const isSortingOn = event.target.dataset.querySet;
        if (isSortingOn === 'true') {
           event.target.setAttribute('data-query-set', 'false');
           empTable.setSortQuery(null); 
        } else {
            event.target.setAttribute('data-query-set', 'true');
            empTable.setSortQuery(event.target.dataset.filterValue);
        }
        tableBody.innerHTML = empTable.renderTable(empTable.tableData);
    }
})
// const debounce(fn, 300);
function filterTable(evt) {
    const value = evt.value;
    const filterKey = evt.dataset.search;
    
    empTable.filterTableByKey(value, filterKey);   
}

document.querySelectorAll('.search-field').forEach((item) => {
    item.addEventListener('input', ()=> {
        
        debounce(function() {filterTable(item)}, 300)();   
    })
});

// code for create employee modal

const modal = document.querySelector("x-modal");
const createEmpButton = document.getElementById('create-employee');

modal.addEventListener("cancel", function() {
    console.log("cancel event raised");
});

modal.addEventListener("ok", function(evt) {
    
    const detail = evt.detail;
    if (detail.mode === 'create') {
        const formData = detail.formData;
        const updatedData = [...empInterFace.employeeInterface.employeeData, formData];
        empTable.setTableData(updatedData);
        tableBody.innerHTML = empTable.renderTable(updatedData);
        empInterFace.save(updatedData);
        localStorage.setItem('empData', JSON.stringify(updatedData));
    }
    else if (detail.mode === 'update') {
        console.log('in here');
        const formData = detail.formData;
        const id = formData.id;
        const updated = empInterFace.employeeInterface.employeeData.map((item) => {
            if (item.id === parseInt(id)) {
                console.log('in here ---')
                return formData;
            } else {
                return item;
            }
        });
        console.log(updated);
        empTable.setTableData(updated);
        tableBody.innerHTML = empTable.renderTable(updated);
        empInterFace.save(updated);
        localStorage.setItem('empData', JSON.stringify(updated));
    } 
});


createEmpButton.addEventListener("click", function() {
    const {employeeInterface:{employeeData}} = empInterFace;
    const lastId =  employeeData.slice(0).sort((a, b) => a.id - b.id)[employeeData.length - 1].id;
    modal.empid = parseInt(lastId) + 1;
    modal.visible = true;
    modal.mode = 'create';
});

/// toggle button
let currentOptions;
tableBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('options-btn')) {
        currentOptions = e.target.querySelector("options-modal");
        currentOptions.visible = true;
        console.log(e.target.dataset);
        currentOptions.empid =  e.target.dataset.id;

        // read
        currentOptions.addEventListener('read', function(evt) {
            const {employeeInterface:{employeeData}} = empInterFace;
            console.log(employeeData);
            const {detail} = evt;
            const emp = employeeData.filter(item => item.id === parseInt(detail))[0];
            console.log(emp);
            modal.empdata = JSON.stringify(emp);
            modal.empid = e.target.dataset.id;
            modal.visible = true;
            modal.mode="read";
        });

        // update
        currentOptions.addEventListener('update', function(evt) {
            const {employeeInterface:{employeeData}} = empInterFace;
            const {detail} = evt;
            const emp = employeeData.filter(item => item.id === parseInt(detail))[0];
            modal.empdata = JSON.stringify(emp);
            modal.empid = e.target.dataset.id;
            modal.visible = true;
            modal.mode="update";
        });

        // delete
        currentOptions.addEventListener('delete', function(evt) {
            const {employeeInterface:{employeeData}} = empInterFace;
            const {detail} = evt;
            const emp = employeeData.filter(item => item.id === parseInt(detail))[0];
            let index;
            modal.empdata = JSON.stringify(emp);
            modal.empid = e.target.dataset.id;
            
            employeeData.forEach((item, i) => {if (item.id === parseInt(e.target.dataset.id) ) { index = i}});
            
            empTable.setTableData(employeeData.splice(index, 1));
            console.log(employeeData)
            tableBody.innerHTML = empTable.renderTable(employeeData);
            empInterFace.save(employeeData);
            localStorage.setItem('empData', JSON.stringify(employeeData));
                
        });
    }
});
