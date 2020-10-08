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
    empTable.setTableData(data[0]);
    empTable.setDefaultFilters();
    tableBody.innerHTML = empTable.renderTable(empTable.tableData);
}).catch((e) => {
    console.log('error is ---', e);
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
