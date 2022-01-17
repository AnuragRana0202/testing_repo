import { LightningElement,wire,api } from 'lwc';
import getContacts from '@salesforce/apex/ProductHelp.getContacts';'@salesforce/apex/ProductHelp.getContacts';
import getPriceBookEntry from '@salesforce/apex/ProductHelp.getPriceBookEntry';
import selectedGetPriceBookEntry from '@salesforce/apex/ProductHelp.selectedGetPriceBookEntry';
import addedProductFunction from '@salesforce/apex/ProductHelp.addedProductFunction';
import insertQuoteLineItem from '@salesforce/apex/ProductHelp.insertQuoteLineItem';
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'List Price', fieldName: 'UnitPrice' },
    { label: 'ProductCode', fieldName: 'ProductCode' },
    { label: 'Description', fieldName: 'Description' },
    { label: 'Family', fieldName: 'Family' }
];
const columnsModal2 = [
    { label: 'Product', fieldName: 'Name' },
    { label: 'List Price', fieldName: 'UnitPrice' },
    { label: 'Sales Price', fieldName: 'SalesPrice', editable: true },
    { label: 'Quantity', fieldName: 'Quantity', editable: true },
    { label: 'Discount', fieldName: 'Discount', editable: true }
];
export default class Task21 extends LightningElement {
 @api recordId;
    contacts;
    editSelectedQuoteLineItems;
    error;
    columns = columns;
    columnsModal2 = columnsModal2;
    warningflag = false;
    isModalOpen = false;
    isModalOpen2 = false;
    isModalOpen3 = false;
    nextFlag = false;
    rawCount = 0;
    finalPriceBookEntryId = [];
    finalSalePrice = [];
    finalListPrice = [];
    finalQuantity = [];
    finalDiscount = [];
    handleKeyChange(event) {
        const proName = event.target.value;
        console.log('proName--->' + proName);
        if (proName === '') {
            this.connectedCallback();
        }
        if (proName) {
            let currentData = [];
            getContacts({ proName }).then(data => {
                data.forEach((row) => {
                    let rowData = {};

                    rowData.UnitPrice = row.UnitPrice;
                    rowData.Id = row.Id;
                    // Account related data
                    if (row.Product2) {
                        rowData.Name = row.Product2.Name;
                        rowData.ProductCode = row.Product2.ProductCode;
                        rowData.Description = row.Product2.Description;
                        rowData.Family = row.Product2.Family;
                    }

                    currentData.push(rowData);
                });

                this.data = currentData;
                this.contacts = this.data;
            })
        } else
            this.contacts = undefined;
    }
    connectedCallback() {
        let currentData = [];
        getPriceBookEntry({
            Qid: this.recordId
        }).then(data => {
            data.forEach((row) => {


                let rowData = {};

                rowData.UnitPrice = row.UnitPrice;
                rowData.Id = row.Id;
                // Account related data
                if (row.Product2) {
                    rowData.Name = row.Product2.Name;
                    rowData.ProductCode = row.Product2.ProductCode;
                    rowData.Description = row.Product2.Description;
                    rowData.Family = row.Product2.Family;
                }

                currentData.push(rowData);
            });

            this.data = currentData;
            this.contacts = this.data;
        })
    }
    getSelectedRec() {
        this.isModalOpen = false;
        this.isModalOpen2 = true;
        this.isModalOpen3 = false;
        var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log('selectedRecordswithnotselect-->' + this.template.querySelector("lightning-datatable"));
        var lstSelectedLeads;
        console.log('selectedRecords are ', selectedRecords);
        var count = 0;
        lstSelectedLeads = selectedRecords;
        let proNameListId = [];

        for (let x = 0; x < lstSelectedLeads.length; x++) {
            proNameListId.push(lstSelectedLeads[x].Id);

            console.log('lstSelectedLeadsId------>' + lstSelectedLeads[x].Id);
            console.log('lstSelectedLeadsName------>' + lstSelectedLeads[x].Name);
            console.log('lstSelectedLeadsUnitPrice------>' + lstSelectedLeads[x].UnitPrice);
            console.log('lstSelectedLeadsProductCode------>' + lstSelectedLeads[x].ProductCode);
            console.log('lstSelectedLeadsDescription------>' + lstSelectedLeads[x].Description);
            console.log('count-->' + count);
            if (count > 50) {
                this.warningflag = true;
                break;
            }
            console.log('lstSelectedLeads------>' + lstSelectedLeads[x].Id);
            count++;
        }
        if (count < 50) {
            this.warningflag = false;
        }
        console.log(count);

        let currentDataForAdded = [];
        addedProductFunction({ proNameListId: proNameListId }).then(data => {
            data.forEach((row) => {
                let rowData = {};

                rowData.UnitPrice = row.UnitPrice;
                rowData.Id = row.Id;
                rowData.SalesPrice = row.UnitPrice;
                // Account related data
                if (row.Product2) {
                    rowData.Name = row.Product2.Name;
                }

                currentDataForAdded.push(rowData);
            });

            this.data = currentDataForAdded;
            this.editSelectedQuoteLineItems = this.data;
        })

    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.isModalOpen2 = false;
        this.isModalOpen3 = false;
    }
    visibleNext() {
        var a = this.template.querySelector("lightning-datatable").getSelectedRows();
        this.rawCount = a.length;
        if (this.rawCount === 0)
            this.nextFlag = false;
        else
            this.nextFlag = true;
        if (this.rawCount > 50) {
            this.warningflag = true;
        }
    }
    backModal() {
        this.isModalOpen = true;
        this.isModalOpen2 = false;
        this.nextFlag = false;
        this.rawCount = 0;
    }
    closeModal2() {
        this.isModalOpen = false;
        this.isModalOpen2 = false;
        this.isModalOpen3 = false;
    }
    showSelectedRecords() {
        this.isModalOpen = false;
        this.isModalOpen2 = false;
        this.isModalOpen3 = true;
        var selectedRecords = this.template.querySelector("lightning-datatable").getSelectedRows();
        let selectedRecordsArray = [];
        for (let x = 0; x < selectedRecords.length; x++) {
            console.log('selectedRecords------>' + selectedRecords[x].Id);
            selectedRecordsArray.push(selectedRecords[x].Id);
        }
        console.log('selectedRecordsArray======>' + selectedRecordsArray);

        let currentData = [];
        selectedGetPriceBookEntry({ selectedRecordsArray: selectedRecordsArray }).then(data => {
            data.forEach((row) => {
                let rowData = {};

                rowData.UnitPrice = row.UnitPrice;
                rowData.Id = row.Id;
                // Account related data
                if (row.Product2) {
                    rowData.Name = row.Product2.Name;
                    rowData.ProductCode = row.Product2.ProductCode;
                    rowData.Description = row.Product2.Description;
                    rowData.Family = row.Product2.Family;
                }

                currentData.push(rowData);
            });

            this.data = currentData;
            this.contacts = this.data;
        })
    }
    backToResults() {
        this.isModalOpen = true;
        console.log('modal1');
        this.connectedCallback();
        console.log('backToResults');

        this.isModalOpen2 = false;
        this.isModalOpen3 = false;
    }
    tempSave(event) {
        var tempStore = this.template.querySelector("lightning-datatable");
        console.log('tempStore----->' + tempStore.data);
        let tempDataStore = tempStore.data;
        for (let x = 0; x < tempDataStore.length; x++) {
            console.log('tempStore[x].Quantity--->' + event.detail.draftValues[x].Quantity);
            console.log('tempStore[x].SalesPrice--->' + event.detail.draftValues[x].SalesPrice);
            this.finalPriceBookEntryId.push(event.detail.draftValues[x].Id);
            this.finalSalePrice.push(event.detail.draftValues[x].SalesPrice);
            this.finalListPrice.push(event.detail.draftValues[x].UnitPrice);
            this.finalQuantity.push(event.detail.draftValues[x].Quantity);
            this.finalDiscount.push(event.detail.draftValues[x].Discount);
        }

    }
    insertQuoteItem() {
        this.isModalOpen = false;
        this.isModalOpen2 = false;
        this.isModalOpen3 = false;
        console.log('Qid-->' + this.recordId);
        console.log('inside hell in a cell');
        console.log('inside finalPriceBookEntryId---->' + this.finalPriceBookEntryId);
        console.log('inside finalSalePrice---->' + this.finalSalePrice);
        console.log('inside finalListPrice---->' + this.finalListPrice);
        console.log('inside finalQuantity---->' + this.finalQuantity);
        console.log('inside finalDiscount---->' + this.finalDiscount);
        insertQuoteLineItem({
            finalPriceBookEntryId: this.finalPriceBookEntryId,
            finalSalePrice: this.finalSalePrice,

            finalQuantity: this.finalQuantity,
            finalDiscount: this.finalDiscount,
            Qid: this.recordId
        })
            .then(result => {
                console.log('hi::' + result);
            })
            .catch(error => {
            });
    }

}