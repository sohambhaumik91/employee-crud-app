import { tableBody, wrapper } from '../constants.js';


class TableModule {
    constructor() {
        this.tableData = [];
        this.page = 1;
        this.rows = 2;
        this.filters = {};
    }
    
    setTableData(data) {
        this.tableData = data;
    }
    setDefaultFilters() {
        const keysArr = Object.keys(this.tableData[0]);
        for(let i = 0; i < keysArr.length; i++) {
            this.filters[keysArr[i]] = {
                status: 'off',
                value:''
            };
        }
    }
    filterArrRec(filterArray, data) {
        if(filterArray.length === 0) {
            return data;
        }
        const filtered = data.filter(item => item[filterArray[0].key].toString().indexOf(filterArray[0].value) > -1);
        return this.filterArrRec(filterArray.slice(1), filtered);
    }
    
    filterTableByKey(value, filterKey) {

        // const currentTableData = this.tableData;
        this.filters[filterKey].value = value;
        if (value.length > 0) {
            this.filters[filterKey].status = 'on';
        } else {
            this.filters[filterKey].status = 'off';
        }
        const filtersArr = [];
        for(let prop in this.filters) {
            if(this.filters[prop].status === 'on') {
                filtersArr.push({key: prop, value: this.filters[prop].value});
            }
        }
        let updatedData;
        if(!filtersArr.length) {
            updatedData = this.tableData;
        } else {
            updatedData = this.filterArrRec(filtersArr, [...this.tableData]);
        }
        console.log(updatedData);
        tableBody.innerHTML = this.renderTable(updatedData);
    }
    
    

    pagination(page, rows, data) {
        const trimStart = (page - 1) * rows;
        const trimEnd = trimStart + rows;
        const trimmedData = data.slice(trimStart, trimEnd);
        const pages = Math.ceil(data.length / rows);

        return {
            'data' : trimmedData,
            'pages' : pages
        }
    }
    setSortQuery(filterVal) {
        this.sortQuery = filterVal;

        // sort data here
        const defaultSortKey = 'id';
        const sortKey = this.sortQuery ? this.sortQuery : defaultSortKey;
        
        const innerData = this.tableData;
        
        const sortedArray = innerData.slice(0).sort(function(a,b) {
            var keyA = a[sortKey],
                keyB = b[sortKey];
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
        this.setTableData(sortedArray);
    }

    pageButtons(pages) {
        wrapper.innerHTML = '';
        
        for(let i = 1; i <= pages; i++) {
            wrapper.innerHTML += `<button data-value=${i}>${i}</button>`
        }
    }

    clickFn() {
        const pageVal = event.target.dataset.value;
        tableBody.innerHTML = '';
        wrapper.innerHTML = '';
        this.page = pageVal;
        tableBody.innerHTML = this.renderTable(this.tableData);
    }
    
    renderTable(data) {
        const tableData = this.pagination(this.page, this.rows, data);
        this.pageButtons(tableData.pages);
        return (`${tableData.data.map(item => {
            return (
                `<tr>
                    <td>EM${item.id}</td>
                    <td>${item.preferredFullName}</td>
                    <td>${item.employeeCode}</td>
                    <td>${item.jobTitleName}</td>
                    <td>${item.phoneNumber}</td>
                    <td>${item.emailAddress}</td>
                    <td>${item.region}</td>
                    <td>${item.dob}</td>
                </tr>`
            )
        }).join('')}`);
    }
}

export default TableModule;