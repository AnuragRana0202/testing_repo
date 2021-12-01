import { LightningElement } from 'lwc';
import getAccount from '@salesforce/apex/AccountController1.getAccount';
import getOpportunity from '@salesforce/apex/AccountController1.getOpportunity';
import getContact from '@salesforce/apex/AccountController1.getContact';
let i=0;
export default class ExampleCode extends LightningElement {
  options;
  value;
  options2;
  options3;
  connectedCallback(){
   getAccount().then(result => {
      var value1 =[];
      for(var name in result){
          value1.push({ label:result[name].Name ,value:result[name].Id })
          console.log(result[name].Name);
      }
      this.options= value1;
      console.log(JSON.stringify(result));
  })
  }
  handleChange(event)
  {
    this.value=event.target.value;
    console.log("value--->"+this.value);
    console.log("inside fun1");
  getContact({ AccId: this.value }).then(result => {
    var value2 =[];
    for(var name in result){
      value2.push({ label:result[name].Name ,value:result[name].Id })
      console.log(result[name].Name);
    }
      this.options2= value2;
      console.log(JSON.stringify(result));
  })

  getOpportunity({ AccId: this.value }).then(result => {
   var value3 =[];
   for(var name in result){

    value3.push({ label:result[name].Name ,value:result[name].Id })
    console.log(result[name].Name);
   }
   this.options3= value3;
   console.log(JSON.stringify(result));
})
}
}