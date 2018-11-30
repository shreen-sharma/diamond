export class MenueDataService {
  static menuItemsData: any[] = [
    {
      'menuName': 'MNUMASTERS',
      'menuId': 1,
      'menuCaption': 'MASTERS',
      'parentId': 0
    },
    {
      'menuName': 'MNUITEMS',
      'menuId': 2,
      'menuCaption': 'ITEMS',
      'parentId': 1
    },
    {
      'menuName': 'MNULOT',
      'menuId': 3,
      'menuCaption': 'LOT',
      'parentId': 2
    },
    {
      'menuName': 'MNUCATEGORY',
      'menuId': 4,
      'menuCaption': 'CATEGORY',
      'parentId': 2
    },
    {
      'menuName': 'MNUPARAMETER',
      'menuId': 5,
      'menuCaption': 'PARAMETER DETAILS',
      'parentId': 2
    },
    {
      'menuName': 'MNUITEMDETAIL',
      'menuId': 6,
      'menuCaption': 'ITEM DETAIL',
      'parentId': 2
    },
    {
      'menuName': 'MNUPROCESSTYPE',
      'menuId': 7,
      'menuCaption': 'PROCESS TYPE',
      'parentId': 2
    },
    {
      'menuName': 'MNUPROCESSDETAIL',
      'menuId': 8,
      'menuCaption': 'PROCESS DETAIL',
      'parentId': 2
    },
    {
      'menuName': 'MNUYIELDDETAIL',
      'menuId': 9,
      'menuCaption': 'YIELD PERCENT',
      'parentId': 2
    },
    {
      'menuName': 'MNUSTONESIZE',
      'menuId': 10,
      'menuCaption': 'STONE SIZE',
      'parentId': 2
    },
    {
      'menuName': 'MNUBANK',
      'menuId': 11,
      'menuCaption': 'BANK',
      'parentId': 1
    },
    {
      'menuName': 'MNUBANKNAME',
      'menuId': 12,
      'menuCaption': 'BANK NAME',
      'parentId': 11
    },
    {
      'menuName': 'MNUTERMSDESC',
      'menuId': 13,
      'menuCaption': 'TERMS DESCRIPTION',
      'parentId': 11
    },
    {
      'menuName': 'MNUBANKTYPE',
      'menuId': 14,
      'menuCaption': 'BANK TYPE',
      'parentId': 11
    },
    {
      'menuName': 'MNUBANKBRANCH',
      'menuId': 15,
      'menuCaption': 'BANK BRANCH',
      'parentId': 11
    },
    {
      'menuName': 'MNUBACONTACTPERSON',
      'menuId': 16,
      'menuCaption': 'CONTACT PERSONS',
      'parentId': 11
    },
    {
      'menuName': 'MNUCORRBANKS',
      'menuId': 17,
      'menuCaption': 'CORRESPONDING BANKS',
      'parentId': 11
    },
    {
      'menuName': 'MNUACCOUNTTYPE',
      'menuId': 18,
      'menuCaption': 'ACCOUNT TYPE',
      'parentId': 11
    },
    {
      'menuName': 'MNUHIERARCHYMAST',
      'menuId': 19,
      'menuCaption': 'HIERARCHY',
      'parentId': 1
    },
    {
      'menuName': 'MNUDIV',
      'menuId': 20,
      'menuCaption': 'DIVISION',
      'parentId': 19
    },
    {
      'menuName': 'MNULOCATIONMAST',
      'menuId': 21,
      'menuCaption': 'LOCATION',
      'parentId': 19
    },
    {
      'menuName': 'MNUDEPTMAST',
      'menuId': 22,
      'menuCaption': 'DEPARTMENT',
      'parentId': 19
    },
    {
      'menuName': 'MNUSDEPTMAST',
      'menuId': 23,
      'menuCaption': 'SUB-DEPARTMENT',
      'parentId': 19
    },
    {
      'menuName': 'MNUVESSELMAIN',
      'menuId': 24,
      'menuCaption': 'VESSEL',
      'parentId': 1
    },
    {
      'menuName': 'MNUVESSEL',
      'menuId': 25,
      'menuCaption': 'VESSEL DETAIL',
      'parentId': 24
    },
    {
      'menuName': 'MNUVESSELRATESLAB',
      'menuId': 26,
      'menuCaption': 'RATE SLAB',
      'parentId': 24
    },
    {
      'menuName': 'MNUVESSELWGTSLAB',
      'menuId': 27,
      'menuCaption': 'WEIGHT SLAB',
      'parentId': 24
    },
    {
      'menuName': 'MNUEXCRATE',
      'menuId': 28,
      'menuCaption': 'EXCHANGE RATE',
      'parentId': 1
    },
    {
      'menuName': 'MNUCUSTOMEXC',
      'menuId': 29,
      'menuCaption': 'CUSTOM EXCHANGE RATE',
      'parentId': 28
    },
    {
      'menuName': 'MNUBANKEXC',
      'menuId': 30,
      'menuCaption': 'BANK EXCHANGE RATE',
      'parentId': 28
    },
    {
      'menuName': 'MNUINSURANCERATE',
      'menuId': 31,
      'menuCaption': 'INSURANCE RATE',
      'parentId': 1
    },
    {
      'menuName': 'MNUREPLENISHMENT',
      'menuId': 32,
      'menuCaption': 'REPLENISHMENT',
      'parentId': 1
    },
    {
      'menuName': 'MNUGENERAL',
      'menuId': 33,
      'menuCaption': 'GENERAL',
      'parentId': 1
    },
    {
      'menuName': 'MNUCURRENCY',
      'menuId': 34,
      'menuCaption': 'CURRENCY',
      'parentId': 33
    },
    {
      'menuName': 'MNUZONECOUNTRYSTATECITY',
      'menuId': 35,
      'menuCaption': 'ZONE, COUNTRY, STATE, CITY',
      'parentId': 33
    },
    {
      'menuName': 'MNUSALUTATION',
      'menuId': 36,
      'menuCaption': 'SALUTATION',
      'parentId': 33
    },
    {
      'menuName': 'MNUDESIGNATION',
      'menuId': 37,
      'menuCaption': 'DESIGNATION',
      'parentId': 33
    },
    {
      'menuName': 'MNUBUSSNATURE',
      'menuId': 38,
      'menuCaption': 'BUSINESS NATURE',
      'parentId': 33
    },
    {
      'menuName': 'MNUBUSSTYPE',
      'menuId': 39,
      'menuCaption': 'BUSINESS TYPE',
      'parentId': 33
    },
    {
      'menuName': 'MNUFIRMNATURE',
      'menuId': 40,
      'menuCaption': 'FIRM NATURE',
      'parentId': 33
    },
    {
      'menuName': 'MNUCOMPANYTYPE',
      'menuId': 41,
      'menuCaption': 'COMPANY TYPE',
      'parentId': 33
    },
    {
      'menuName': 'MNUOTHERMASTER',
      'menuId': 42,
      'menuCaption': 'OTHER MASTERS',
      'parentId': 1
    },
    {
      'menuName': 'MNUSHIPMENTTYPE',
      'menuId': 43,
      'menuCaption': 'SHIPMENT TYPE',
      'parentId': 42
    },
    {
      'menuName': 'MNUDESPATCHED',
      'menuId': 44,
      'menuCaption': 'DISPATCHED BY NOTE',
      'parentId': 42
    },
    {
      'menuName': 'MNUEXPORTUNDER',
      'menuId': 45,
      'menuCaption': 'EXPORT UNDER',
      'parentId': 42
    },
    {
      'menuName': 'MNUCOMMUNICATION',
      'menuId': 46,
      'menuCaption': 'COMMUNICATION TYPE',
      'parentId': 42
    },
    {
      'menuName': 'MNUTAX',
      'menuId': 47,
      'menuCaption': 'TAX DETAIL',
      'parentId': 42
    },
    {
      'menuName': 'MNUGROSSHEAD',
      'menuId': 48,
      'menuCaption': 'GROSS HEAD',
      'parentId': 42
    },
    {
      'menuName': 'MNUREFERENCE',
      'menuId': 49,
      'menuCaption': 'REFERENCE',
      'parentId': 42
    },
    {
      'menuName': 'MNUPORT',
      'menuId': 50,
      'menuCaption': 'PORT',
      'parentId': 42
    },
    {
      'menuName': 'MNUPREFIX',
      'menuId': 51,
      'menuCaption': 'PREFIX',
      'parentId': 42
    },
    {
      'menuName': 'MNUSUFFIX',
      'menuId': 52,
      'menuCaption': 'SUFFIX',
      'parentId': 42
    },
    {
      'menuName': 'MNUMARKNO',
      'menuId': 53,
      'menuCaption': 'MARK NO.',
      'parentId': 42
    },
    {
      'menuName': 'MNUCONTAINER',
      'menuId': 54,
      'menuCaption': 'KIND OF CONTAINER',
      'parentId': 42
    },
    {
      'menuName': 'MNUUNIT',
      'menuId': 55,
      'menuCaption': 'UNIT',
      'parentId': 42
    },
    {
      'menuName': 'MNUCHARGES',
      'menuId': 56,
      'menuCaption': 'CHARGES',
      'parentId': 42
    },
    {
      'menuName': 'MNUBOXSIZE',
      'menuId': 57,
      'menuCaption': 'BOX SIZE',
      'parentId': 42
    },
    {
      'menuName': 'MNUCOMP',
      'menuId': 58,
      'menuCaption': 'COMPANY',
      'parentId': 0
    },
    {
      'menuName': 'MNUHIERARCHY',
      'menuId': 59,
      'menuCaption': 'HIERARCHY',
      'parentId': 58
    },
    {
      'menuName': 'MNUCOMPANY',
      'menuId': 60,
      'menuCaption': 'COMPANY DETAIL',
      'parentId': 58
    },
    {
      'menuName': 'MNUCOMPANYREGISTRATIONDETAIL',
      'menuId': 61,
      'menuCaption': 'COMPANY REGISTRATION DETAIL',
      'parentId': 58
    },
    {
      'menuName': 'MNUCOMPHIERARCHYDETAIL',
      'menuId': 62,
      'menuCaption': 'COMPANY HIERARCHY DETAIL',
      'parentId': 58
    },
    {
      'menuName': 'MNUSUBDEPTPROCESS',
      'menuId': 63,
      'menuCaption': 'SUB-DEPARTMENT PROCESS',
      'parentId': 58
    },
    {
      'menuName': 'MNUPARTNER',
      'menuId': 64,
      'menuCaption': 'PARTNER',
      'parentId': 58
    },
    {
      'menuName': 'MNUEMPLOYEES',
      'menuId': 65,
      'menuCaption': 'EMPLOYEES',
      'parentId': 58
    },
    {
      'menuName': 'MNULOCONTACTPERSON',
      'menuId': 66,
      'menuCaption': 'CONTACT PERSONS',
      'parentId': 58
    },
    {
      'menuName': 'MNUBANKDETAILS',
      'menuId': 67,
      'menuCaption': 'COMPANY BANK DETAILS',
      'parentId': 58
    },
    {
      'menuName': 'MNUPARTY',
      'menuId': 68,
      'menuCaption': 'PARTY',
      'parentId': 58
    },
    {
      'menuName': 'MNUPARTYDETAILS',
      'menuId': 69,
      'menuCaption': 'PARTY DETAILS',
      'parentId': 68
    },
    {
      'menuName': 'MNUPARTYACCOUNT',
      'menuId': 70,
      'menuCaption': 'PARTY ACCOUNT',
      'parentId': 68
    },
    {
      'menuName': 'MNUPARTYCONTACTS',
      'menuId': 71,
      'menuCaption': 'CONTACT PERSONS',
      'parentId': 68
    },
    {
      'menuName': 'MNUPARTYBANKSTATUS',
      'menuId': 72,
      'menuCaption': 'BANK STATUS',
      'parentId': 68
    },
    {
      'menuName': 'MNUPARTYTDSDETAIL',
      'menuId': 73,
      'menuCaption': 'TDS DETAIL',
      'parentId': 68
    },
    {
      'menuName': 'MNULABOURRATE',
      'menuId': 74,
      'menuCaption': 'LABOUR RATE',
      'parentId': 68
    },
    {
      'menuName': 'MNUTRANSACTION',
      'menuId': 75,
      'menuCaption': 'TRANSACTION',
      'parentId': 0
    },
    {
      'menuName': 'MNUOPENINGSTOCK',
      'menuId': 76,
      'menuCaption': 'OPENING STOCK',
      'parentId': 75
    },
    {
      'menuName': 'MNUITEMOS',
      'menuId': 77,
      'menuCaption': 'ITEM',
      'parentId': 76
    },
    {
      'menuName': 'MNUSTOCKMGNT',
      'menuId': 78,
      'menuCaption': 'STOCK MANAGEMENT',
      'parentId': 75
    },
    {
      'menuName': 'MNULOTHIERARCHY',
      'menuId': 79,
      'menuCaption': 'LOT HIERARCHY',
      'parentId': 78
    },
    {
      'menuName': 'MNULOTCREATION',
      'menuId': 80,
      'menuCaption': 'COMPANY LOT ALLOTMENT',
      'parentId': 78
    },
    {
      'menuName': 'MNUIMPORTASSIGN',
      'menuId': 81,
      'menuCaption': 'IMPORT ASSIGNMENT',
      'parentId': 78
    },
    {
      'menuName': 'MNUALLOTITEM',
      'menuId': 82,
      'menuCaption': 'LOT ITEM ALLOT',
      'parentId': 78
    },
    {
      'menuName': 'MNUITEMTRANSFER',
      'menuId': 83,
      'menuCaption': 'LOT ITEM TRANSFER',
      'parentId': 78
    },
    {
      'menuName': 'MNUITEMMERGING',
      'menuId': 84,
      'menuCaption': 'LOT ITEM MERGING',
      'parentId': 78
    },
    {
      'menuName': 'MNUITEMRATEUPDATION',
      'menuId': 85,
      'menuCaption': 'ITEM RATE UPDATION',
      'parentId': 78
    },
    {
      'menuName': 'MNUSTOCKADJ',
      'menuId': 86,
      'menuCaption': 'STOCK ADJUSTMENT',
      'parentId': 75
    },
    {
      'menuName': 'MNUSAGOODSIN',
      'menuId': 87,
      'menuCaption': 'GOODS INWARD',
      'parentId': 86
    },
    {
      'menuName': 'MNUSAGOODSOUT',
      'menuId': 88,
      'menuCaption': 'GOODS OUTWARD',
      'parentId': 86
    },
    {
      'menuName': 'MNUPHYSICALSTADJ',
      'menuId': 89,
      'menuCaption': 'PHYSICAL STOCK ADJUSTMENT',
      'parentId': 86
    },
    {
      'menuName': 'MNUINTERDEPTTRANS',
      'menuId': 90,
      'menuCaption': 'INTERDEPARTMENT TRANSFER',
      'parentId': 75
    },
    {
      'menuName': 'MNUINTERSDEPTISSUE',
      'menuId': 91,
      'menuCaption': 'ISSUE',
      'parentId': 90
    },
    {
      'menuName': 'MNUINTERSDEPTRETURN',
      'menuId': 92,
      'menuCaption': 'RETURN',
      'parentId': 90
    },
    {
      'menuName': 'MNUJANGAD',
      'menuId': 93,
      'menuCaption': 'JANGAD',
      'parentId': 75
    },
    {
      'menuName': 'MNUROUGHISSUE',
      'menuId': 94,
      'menuCaption': 'ROUGH ISSUE',
      'parentId': 93
    },
    {
      'menuName': 'MNUPOLISHISSUE',
      'menuId': 95,
      'menuCaption': 'POLISH ISSUE',
      'parentId': 93
    },
    {
      'menuName': 'MNUREPAIRISSUE',
      'menuId': 96,
      'menuCaption': 'REPAIR ISSUE',
      'parentId': 93
    },
    {
      'menuName': 'MNUBULKISSUE',
      'menuId': 97,
      'menuCaption': 'BULK ISSUE',
      'parentId': 93
    },
    {
      'menuName': 'MNUOTHERISSUE',
      'menuId': 98,
      'menuCaption': 'OTHER ISSUE',
      'parentId': 93
    },
    {
      'menuName': 'MNUJANGADRECEIVED',
      'menuId': 99,
      'menuCaption': 'GENERAL RETURN',
      'parentId': 93
    },
    {
      'menuName': 'MNUBULKRETURN',
      'menuId': 100,
      'menuCaption': 'BULK RETURN',
      'parentId': 93
    },
    {
      'menuName': 'MNUJANGADLABORBILLGENERAL',
      'menuId': 101,
      'menuCaption': 'LABOR BILL (GENERAL)',
      'parentId': 93
    },
    {
      'menuName': 'MNUJANGADLABORBILLBULK',
      'menuId': 102,
      'menuCaption': 'LABOR BILL (BULK)',
      'parentId': 93
    },
    {
      'menuName': 'MNUJANGADMIX',
      'menuId': 103,
      'menuCaption': 'JANGAD MIXING',
      'parentId': 93
    },
    {
      'menuName': 'MNUIMPORT',
      'menuId': 104,
      'menuCaption': 'IMPORT',
      'parentId': 75
    },
    {
      'menuName': 'MNUIMPPURCHASEORD',
      'menuId': 105,
      'menuCaption': 'PURCHASE ORDER',
      'parentId': 104
    },
    {
      'menuName': 'MNUIMPINVOICE',
      'menuId': 106,
      'menuCaption': 'INVOICE',
      'parentId': 104
    },
    {
      'menuName': 'MNUREMIT',
      'menuId': 107,
      'menuCaption': 'REMITTANCE',
      'parentId': 104
    },
    {
      'menuName': 'MNULPURCHASE',
      'menuId': 108,
      'menuCaption': 'LOCAL PURCHASE',
      'parentId': 75
    },
    {
      'menuName': 'MNULPO',
      'menuId': 109,
      'menuCaption': 'PURCHASE ORDER',
      'parentId': 108
    },
    {
      'menuName': 'MNULPINVOICE',
      'menuId': 110,
      'menuCaption': 'PURCHASE INVOICE',
      'parentId': 108
    },
    {
      'menuName': 'MNUPURPAYMENT',
      'menuId': 111,
      'menuCaption': 'PURCHASE PAYMENT',
      'parentId': 108
    },
    {
      'menuName': 'MNUEXPORT',
      'menuId': 112,
      'menuCaption': 'EXPORT',
      'parentId': 75
    },
    {
      'menuName': 'MNUESO',
      'menuId': 113,
      'menuCaption': 'SALES ORDER',
      'parentId': 112
    },
    {
      'menuName': 'MNUEINVOICE',
      'menuId': 114,
      'menuCaption': 'INVOICE',
      'parentId': 112
    },
    {
      'menuName': 'MNUSHIPPINGBILL',
      'menuId': 115,
      'menuCaption': 'SHIPPING BILL INFO',
      'parentId': 112
    },
    {
      'menuName': 'MNUEXCDRAFT',
      'menuId': 116,
      'menuCaption': 'EXCHANGE DRAFT',
      'parentId': 112
    },
    {
      'menuName': 'MNUBANKCOVERINGLETTER',
      'menuId': 117,
      'menuCaption': 'BANK COVERING LETTER',
      'parentId': 112
    },
    {
      'menuName': 'MNUBANKCERTIFICATE',
      'menuId': 118,
      'menuCaption': 'BANK CERTIFICATE',
      'parentId': 112
    },
    {
      'menuName': 'MNUEXPREALISATION',
      'menuId': 119,
      'menuCaption': 'REALISATION',
      'parentId': 112
    },
    {
      'menuName': 'MNULOCALSALES',
      'menuId': 120,
      'menuCaption': 'LOCAL SALES',
      'parentId': 75
    },
    {
      'menuName': 'MNULSO',
      'menuId': 121,
      'menuCaption': 'SALES ORDER',
      'parentId': 120
    },
    {
      'menuName': 'MNULSINVOICE',
      'menuId': 122,
      'menuCaption': 'SALES INVOICE',
      'parentId': 120
    },
    {
      'menuName': 'MNUSALESRECEIPT',
      'menuId': 123,
      'menuCaption': 'SALES RECEIPT',
      'parentId': 120
    },
    {
      'menuName': 'MNUREASSORT',
      'menuId': 124,
      'menuCaption': 'RE-ASSORTMENT',
      'parentId': 75
    },
    {
      'menuName': 'MNULICENCE',
      'menuId': 125,
      'menuCaption': 'LICENCE',
      'parentId': 0
    },
    {
      'menuName': 'MNULICAPPL',
      'menuId': 126,
      'menuCaption': 'APPLICATION',
      'parentId': 125
    },
    {
      'menuName': 'MNULICNEW',
      'menuId': 127,
      'menuCaption': 'NEW LICENCE',
      'parentId': 125
    },
    {
      'menuName': 'MNULICENHAN',
      'menuId': 128,
      'menuCaption': 'LICENCE ENHANCEMENT',
      'parentId': 125
    },
    {
      'menuName': 'MNULICPURCHASE',
      'menuId': 129,
      'menuCaption': 'PURCHASE',
      'parentId': 125
    },
    {
      'menuName': 'MNULICSALELOAN',
      'menuId': 130,
      'menuCaption': 'REP LIC. SALE / TRANSFER (LOAN)',
      'parentId': 125
    },
    {
      'menuName': 'MNUBANKTRAN',
      'menuId': 134,
      'menuCaption': 'BANK',
      'parentId': 0
    },
    {
      'menuName': 'MNUADVANCERULE',
      'menuId': 135,
      'menuCaption': 'ADVANCE DEFINATION',
      'parentId': 134
    },
    {
      'menuName': 'MNUADVANCETYPE',
      'menuId': 136,
      'menuCaption': 'TYPE',
      'parentId': 135
    },
    {
      'menuName': 'MNUBKADVDETAIL',
      'menuId': 137,
      'menuCaption': 'ADVANCE DETAIL',
      'parentId': 135
    },
    {
      'menuName': 'MNUINTSLABS',
      'menuId': 138,
      'menuCaption': 'INTEREST SLABS',
      'parentId': 135
    },
    {
      'menuName': 'MNUADVANCES',
      'menuId': 139,
      'menuCaption': 'ADVANCES',
      'parentId': 134
    },
    {
      'menuName': 'MNULOANAPPL',
      'menuId': 140,
      'menuCaption': 'APPLICATION',
      'parentId': 139
    },
    {
      'menuName': 'MNUADVANCEAVAILED',
      'menuId': 141,
      'menuCaption': 'ADVANCE AVAILED',
      'parentId': 139
    },
    {
      'menuName': 'MNUFWDCONTRACT',
      'menuId': 142,
      'menuCaption': 'FORWARD CONTRACT',
      'parentId': 134
    },
    {
      'menuName': 'MNUNEWFWDCONT',
      'menuId': 143,
      'menuCaption': 'NEW CONTRACT',
      'parentId': 142
    },
    {
      'menuName': 'MNURENEWFWDCONT',
      'menuId': 144,
      'menuCaption': 'RENEW FOWARD CONTRACT',
      'parentId': 142
    },
    {
      'menuName': 'MNUREPORT',
      'menuId': 145,
      'menuCaption': 'REPORTS',
      'parentId': 0
    },
    {
      'menuName': 'MNUUTILITY',
      'menuId': 146,
      'menuCaption': 'UTILITY',
      'parentId': 0
    },
    {
      'menuName': 'MNUBACKUP',
      'menuId': 147,
      'menuCaption': 'DATA BACKUP / RECOVERY',
      'parentId': 146
    },
    {
      'menuName': 'MNUSTOCKVIEW',
      'menuId': 148,
      'menuCaption': 'STOCK ANALYZER',
      'parentId': 146
    },
    {
      'menuName': 'MNUCONSIGNMENTISSUE',
      'menuId': 149,
      'menuCaption': 'CONSIGNMENT ISSUE',
      'parentId': 93
    },
    {
      'menuName': 'MNUCONSIGNMENTRETURN',
      'menuId': 150,
      'menuCaption': 'CONSIGNMENT RETURN',
      'parentId': 93
    },
    {
      'menuName': 'MNUSEARCHTOOL',
      'menuId': 151,
      'menuCaption': 'PURCHASE / SALES ANALYZER',
      'parentId': 146
    }
  ]
}
