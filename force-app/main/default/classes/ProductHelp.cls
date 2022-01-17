public with sharing class ProductHelp {

    @AuraEnabled(Cacheable=true)
    public static List <PricebookEntry> getContacts(String proName) {
     String proNameLike = '%'+proName+'%';
    List<PricebookEntry> proList = [SELECT ID,Product2.Name,Product2.ProductCode,Product2.Description,Product2.Family,UnitPrice FROM PricebookEntry Where Product2.Name like :proNameLike];
    return proList;
    }
    @AuraEnabled(Cacheable=true)
    public static List <PricebookEntry> getPriceBookEntry(String Qid) {
    Quote Qu= new Quote();
    Qu =[SELECT ID,PriceBook2Id from Quote where ID=:Qid];
    String pbID=Qu.PriceBook2Id;
    List<PricebookEntry> proList = [SELECT ID,Product2.Name,Product2.ProductCode,Product2.Description,Product2.Family,UnitPrice FROM  PricebookEntry where PriceBook2Id=:pbID];
    return proList;
    }
    @AuraEnabled(Cacheable=true)
    public static List <PricebookEntry> selectedGetPriceBookEntry(List<String> selectedRecordsArray){
     System.debug('selectedRecordsArray--->'+selectedRecordsArray);
     List<PricebookEntry> proList = [SELECT ID,Product2.Name,Product2.ProductCode,Product2.Description,Product2.Family,UnitPrice FROM PricebookEntry where ID In:selectedRecordsArray];
     System.debug('proList--->'+proList);
     return proList;
    }
    @AuraEnabled(Cacheable=true)
    public static List <PricebookEntry> addedProductFunction(List<String> proNameListId){
    List<PricebookEntry> proList = [SELECT ID,Product2.Name,UnitPrice FROM PricebookEntry where ID In:proNameListId];
    return proList;
    }
    @AuraEnabled
     public static Boolean insertQuoteLineItem(List<String> finalPriceBookEntryId,List<String> finalSalePrice,List<String>finalQuantity,List<String> finalDiscount,String Qid){
    List<QuoteLineItem> QlineItemList = new List<QuoteLineItem>();
    for(Integer x=0;x<finalPriceBookEntryId.size();x++)
    {
    QuoteLineItem qli = new QuoteLineItem();
    qli.PricebookEntryId=finalPriceBookEntryId.get(x);
    qli.QuoteId=Qid;
    qli.UnitPrice=decimal.valueOf(finalSalePrice.get(x));
    qli.Quantity=decimal.valueOf(finalQuantity.get(x));
    qli.Discount=decimal.valueOf(finalDiscount.get(x));
    QlineItemList.add(qli);
    }
    insert QlineItemList;
    system.debug('QlineItemList-->'+QlineItemList);
    return TRUE;
    }
}
