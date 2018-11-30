export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'general.menu.masters',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
        children: [
          // {
          //   path: 'zoneEntry',
          //   data: { menu: { title: 'general.menu.geographicalLocation', icon: 'ion-ios-list-outline' } },
          //   //   children: [
          //   //      { path: 'zoneEntry',
          //   //   data: { menu: {title: 'general.menu.zone_entry', icon: 'ion-ios-list-outline'}}
          //   // },
          //   //       ]
          // },
          // {
          //   path: 'common',
          //   data: { menu: { title: 'general.menu.common', icon: 'ion-ios-list-outline' } }
          // },
          // {
          //   path: 'currency',
          //   data: { menu: { title: 'general.menu.currency', icon: 'ion-ios-list-outline' } }
          // },





          {
            path: 'masters',
            data: { menu: { title: 'general.menu.general' } },
            children: [
              {
                path: 'zoneEntry',
                data: { menu: { title: 'general.menu.geographicalLocation', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'common',
                data: { menu: { title: 'general.menu.common', icon: 'ion-ios-list-outline' } },
              },
              {
                path: 'currency',
                data: { menu: { title: 'general.menu.currency', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'exchangeRate',
                data: { menu: { title: 'general.menu.exchange_rate', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'categories',
                data: { menu: { title: 'general.menu.categories', icon: 'ion-ios-list-outline' } }
              },
            ]
          },
          {
            path: 'masters',
            data: { menu: { title: 'general.menu.parameter_details' } },
            children: [
              {
                path: 'paraList',
                data: { menu: { title: 'general.menu.parameter_list', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'paraValue',
                data: { menu: { title: 'general.menu.parameter_value', icon: 'ion-ios-list-outline' } }
              }
            ]
          },



          {
            path: 'masters',
            data: { menu: { title: 'general.menu.items' } },
            children: [

              {
                path: 'itemDetail',
                data: { menu: { title: 'general.menu.itemDetail', icon: 'ion-ios-list-outline' } }
              },

              {
                path: 'proType',
                data: { menu: { title: 'general.menu.proType', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'proDetail',
                data: { menu: { title: 'general.menu.proDetail', icon: 'ion-ios-list-outline' } }
              },


            ]
          },

          {
            path: 'stockManagement',
            data: { menu: { title: 'general.menu.lotDetail' } },
            children: [
              {
                path: 'lots',
                data: { menu: { title: 'general.menu.lot', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'lotItemCreation',
                data: { menu: { title: 'general.menu.lotItemCreation', icon: 'ion-ios-list-outline' } }
              },
            ]
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.bank' } },
            children: [
              {
                path: 'bankBranch',
                data: { menu: { title: 'general.menu.bank_branch', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'contactPersons',
                data: { menu: { title: 'general.menu.contact_persons', icon: 'ion-ios-list-outline' } }
              }
            ]
          },

        ]
      },
      {
        path: 'company',
        data: { menu: { title: 'general.menu.Company', icon: 'fa fa-building' } },
        children: [
          {
            path: 'hierarchyCreation',
            data: { menu: { title: 'general.menu.hierarchy_creation', icon: 'ion-ios-list-outline' } }
          },
          {
            path: 'hierarchyRelation',
            data: { menu: { title: 'general.menu.hierarchy_relation', icon: 'ion-ios-list-outline' } }
          },
          {
            path: 'partyDetails',
            data: { menu: { title: 'general.menu.partyDetails', icon: 'ion-ios-list-outline' } }
          },
          // {
          //   path: 'partyAccount',
          //   data: { menu: { title: 'general.menu.partyAccount', icon: 'ion-ios-list-outline' } }
          // },
          // {
          //   path: 'companyEmployee',
          //   data: { menu: { title: 'general.menu.companyEmployee', icon: 'ion-ios-list-outline' } }
          // },

          // { path: 'setup',
          // data: { menu: {title: 'general.menu.setup', icon: 'ion-ios-list-outline'}}
          // }
        ]
      },


      {
        path: '',
        data: { menu: { title: 'general.menu.openingStockInvoice', icon: 'ion-arrow-graph-up-left' } },
        children: [

          {
            path: 'stockManagement',
            data: { menu: { title: 'Stock Entry' } },
            children: [

              {
                path: 'openingStockEntry',
                data: { menu: { title: 'general.menu.openingStockEntry', icon: 'ion-ios-list-outline' } }
              },
            ]
          },
          {
            path: 'stockManagement',
            data: { menu: { title: 'Balance Sheet' } },
            children: [

              {
                path: 'balanceSheet',
                data: { menu: { title: 'general.menu.balanceSheet', icon: 'fa fa-balance-scale' } }
              },
            ]
          },

          {
            path: 'transaction',
            data: { menu: { title: 'Invoices' } },
            children: [
              {
                path: 'openingDCIssue',
                data: { menu: { title: 'general.menu.opening_dc_issue', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'locPurInvoice',
                data: { menu: { title: 'general.menu.loc_Pur_invoice', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'locSalInvoice',
                data: { menu: { title: 'general.menu.loc_sal_invoice', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'ImpPurInvoice',
                data: { menu: { title: 'general.menu.imp_pur_invoice', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'ExpSalesInvoice',
                data: { menu: { title: 'general.menu.export_invoice', icon: 'ion-ios-list-outline' } }
              },
            ]
          },




        ]
      },



      {
        path: 'stockManagement',
        data: { menu: { title: 'general.menu.StockManagement', icon: 'fa fa-money' } },
        children: [


          {
            path: 'itemAllotment',
            data: { menu: { title: 'general.menu.item_Allotment', icon: 'ion-ios-list-outline' } }
          },
          {
            path: 'itemTransfer',
            data: { menu: { title: 'general.menu.item_Transfer', icon: 'ion-ios-list-outline' } }
          },
          {
            path: 'itemMerging',
            data: { menu: { title: 'general.menu.item_Merging', icon: 'ion-ios-list-outline' } }
          },
          {
            path: 'itemRateUpdation',
            data: { menu: { title: 'general.menu.item_Rate_Updation', icon: 'ion-ios-list-outline' } }
          },
          {
            path: 'physicalStockAdjustment',
            data: { menu: { title: 'general.menu.physical_Stock_Adjustment', icon: 'ion-arrow-graph-up-right' } }
          }
        ]
      },
      {
        path: 'transaction',
        data: { menu: { title: 'general.menu.transaction', icon: 'fa fa-exchange' } },
        children: [

          {
            path: '',
            data: { menu: { title: 'general.menu.delivery_challan' } },
            children: [
              {
                path: 'deliveryChallanIssue',
                data: { menu: { title: 'general.menu.delivery_challan_issue', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'deliveryChallanReturn',
                data: { menu: { title: 'general.menu.delivery_challan_return', icon: 'ion-ios-list-outline' } }
              }
            ]
          },
          {
            path: '',
            data: { menu: { title: 'general.menu.local_Purchase' } },
            children: [
              {
                path: 'purchaseOrder',
                data: { menu: { title: 'general.menu.purchase_order', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'purchaseInvoiceComponent',
                data: { menu: { title: 'general.menu.purchase_Invoice', icon: 'ion-ios-list-outline' } }
              }
            ]
          },
          {
            path: '',
            data: { menu: { title: 'general.menu.local_Sales' } },
            children: [
              {
                path: 'salesOrder',
                data: { menu: { title: 'general.menu.sales_order', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'localSaleInvoiceComponent',
                data: { menu: { title: 'general.menu.local_invoice', icon: 'ion-ios-list-outline' } }
              }
            ]
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.import' } },
            children: [
              {
                path: 'importPurchaseOrder',
                data: { menu: { title: 'general.menu.importPurchaseOrder', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'importInvoice',
                data: { menu: { title: 'general.menu.import_invoice', icon: 'ion-ios-list-outline' } }
              },

            ]
          },
          {
            path: '',
            data: { menu: { title: 'general.menu.export' } },
            children: [
              {
                path: 'exportSalesOrder',
                data: { menu: { title: 'general.menu.export_sales_order', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'exportInvoice',
                data: { menu: { title: 'general.menu.export_invoice', icon: 'ion-ios-list-outline' } }
              },
            ]
          },
          {
            path: '',
            data: { menu: { title: 'general.menu.payment_receipt' } },
            children: [
              {
                path: 'paymentEntry',
                data: { menu: { title: 'general.menu.payment_entry', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'receiptEntry',
                data: { menu: { title: 'general.menu.receipt_entry', icon: 'ion-ios-list-outline' } }
              },
              {
                path: 'brokerPayment',
                data: { menu: { title: 'general.menu.brokerPayment', icon: 'ion-ios-list-outline' } }
              }
            ]
          },

          {
            path: 'agGrid',
            data: { menu: { title: 'general.menu.payment_receipt' } },
            
          }

        ]
      },
      {
        path: 'reports',
        data: { menu: { title: 'general.menu.reports', icon: 'fa fa-book' } },
        children: [
          {
            path: '',
            data: { menu: { title: 'general.menu.stockReport' } },
            children: [
              {
                path: 'stockSummaryStockRateReport',
                data: { menu: { title: 'general.menu.stockSummaryStockRateReport', icon: 'ion-document' } }
              },
              {
                path: 'stockSummarySellingPriceReport',
                data: { menu: { title: 'general.menu.stockSummarySellingPriceReport', icon: 'ion-document' } }
              },
              {
                path: 'stockSummaryReport',
                data: { menu: { title: 'general.menu.stockSummaryReport', icon: 'ion-document' } }
              },
              {
                path: 'dcSummaryReport',
                data: { menu: { title: 'general.menu.dcSummaryReport', icon: 'ion-document' } }
              },
              {
                path: 'consignmentSummayReport',
                data: { menu: { title: 'general.menu.consignmentSummayReport', icon: 'ion-document' } }
              },
              {
                path: 'lotItemReport',
                data: { menu: { title: 'general.menu.lotItemReport', icon: 'ion-document' } }
              },
              {
                path: 'summaryReport',
                data: { menu: { title: 'general.menu.summaryReport', icon: 'ion-document' } }
              },
              {
                path: 'combinedSummary',
                data: { menu: { title: 'general.menu.combinedSummary', icon: 'ion-document' } }
              }

            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.stockSizeReport' } },
            children: [

              {
                path: 'totalStockSizeReport',
                data: { menu: { title: 'general.menu.totalStockSizeReport', icon: 'ion-document' } }
              },

              {
                path: 'physicalStockSizeReport',
                data: { menu: { title: 'general.menu.physicalStockSizeReport', icon: 'ion-document' } }
              },

              {
                path: 'dcStockSizeReport',
                data: { menu: { title: 'general.menu.dcStockSizeReport', icon: 'ion-document' } }
              },

              {
                path: 'consignmentStockSizeReport',
                data: { menu: { title: 'general.menu.consignmentStockSizeReport', icon: 'ion-document' } }
              },


            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.stockQualityReport' } },
            children: [

              {
                path: 'totalStockQualityReport',
                data: { menu: { title: 'general.menu.totalStockQualityReport', icon: 'ion-document' } }
              },
              {
                path: 'physicalStockQualityReport',
                data: { menu: { title: 'general.menu.physicalStockQualityReport', icon: 'ion-document' } }
              },
              {
                path: 'dcStockQualityReport',
                data: { menu: { title: 'general.menu.dcStockQualityReport', icon: 'ion-document' } }
              },

              {
                path: 'consignmentStockQualityReport',
                data: { menu: { title: 'general.menu.consignmentStockQualityReport', icon: 'ion-document' } }
              },


            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.payableReport' } },
            children: [
              {
                path: 'payableImportInvoiceReport',
                data: { menu: { title: 'general.menu.payableImportInvoiceReport', icon: 'ion-document' } }
              },
              {
                path: 'payableLocalInvoiceReport',
                data: { menu: { title: 'general.menu.payableLocalInvoiceReport', icon: 'ion-document' } }
              },


            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.receivablesReport' } },
            children: [
              {
                path: 'receivablesExportInvoiceReport',
                data: { menu: { title: 'general.menu.receivablesExportInvoiceReport', icon: 'ion-document' } }
              },
              {
                path: 'receivablesLocalInvoiceReport',
                data: { menu: { title: 'general.menu.receivablesLocalInvoiceReport', icon: 'ion-document' } }
              },


            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.transactionReport' } },
            children: [
              {
                path: 'receivablesCustomerBrokerage',
                data: { menu: { title: 'general.menu.receivablesCustomerBrokerage', icon: 'ion-document' } }
              },
              {
                path: 'receivablesByBroker',
                data: { menu: { title: 'general.menu.receivablesByBroker', icon: 'ion-document' } }
              },
              {
                path: 'payableCustomerBrokerage',
                data: { menu: { title: 'general.menu.payableCustomerBrokerage', icon: 'ion-document' } }
              },
              {
                path: 'payableByBroker',
                data: { menu: { title: 'general.menu.payableByBroker', icon: 'ion-document' } }
              },
              {
                path: 'kdRegister',
                data: { menu: { title: 'general.menu.kdRegister', icon: 'ion-document' } }
              },
              {
                path: 'kdAgainstPI',
                data: { menu: { title: 'general.menu.kdAgainstPI', icon: 'ion-document' } }
              },
              {
                path: 'consignmentDcRegister',
                data: { menu: { title: 'general.menu.consignmentDcRegister', icon: 'ion-document' } }
              }
            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.invoiceReport' } },
            children: [
              {
                path: '',
                data: { menu: { title: 'general.menu.localPurchaseReport', icon: 'ion-ios-list-outline' } },
                children: [
                  {
                    path: 'localPurchaseMonthlyReport',
                    data: { menu: { title: 'general.menu.localPurchaseMonthlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'localPurchaseYearlyReport',
                    data: { menu: { title: 'general.menu.localPurchaseYearlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'localPurchaseSupplierReport',
                    data: { menu: { title: 'general.menu.localPurchaseSupplierReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'localPurchaseDateWiseReport',
                    data: { menu: { title: 'general.menu.localPurchaseDateWiseReport', icon: 'ion-document' } }
                  },

                ]
              },
              {
                path: '',
                data: { menu: { title: 'general.menu.importPurchaseReport', icon: 'ion-ios-list-outline' } },
                children: [
                  {
                    path: 'importPurchaseMonthlyReport',
                    data: { menu: { title: 'general.menu.importPurchaseMonthlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'importPurchaseYearlyReport',
                    data: { menu: { title: 'general.menu.importPurchaseYearlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'importPurchaseSupplierReport',
                    data: { menu: { title: 'general.menu.importPurchaseSupplierReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'importPurchaseDateWiseReport',
                    data: { menu: { title: 'general.menu.importPurchaseDateWiseReport', icon: 'ion-document' } }
                  },
                ]
              },
              {
                path: '',
                data: { menu: { title: 'general.menu.localSalesReport', icon: 'ion-ios-list-outline' } },
                children: [
                  {
                    path: 'localSalesMonthlyReport',
                    data: { menu: { title: 'general.menu.localSalesMonthlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'localSalesYearlyReport',
                    data: { menu: { title: 'general.menu.localSalesYearlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'localSalesCustomerReport',
                    data: { menu: { title: 'general.menu.localSalesCustomerReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'localSalesDateWiseReport',
                    data: { menu: { title: 'general.menu.localSalesDateWiseReport', icon: 'ion-document' } }
                  },
                ]
              },
              {
                path: '',
                data: { menu: { title: 'general.menu.exportSalesReport', icon: 'ion-ios-list-outline' } },
                children: [
                  {
                    path: 'exportMonthlyReport',
                    data: { menu: { title: 'general.menu.exportMonthlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'exportYearlyReport',
                    data: { menu: { title: 'general.menu.exportYearlyReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'exportCustomerReport',
                    data: { menu: { title: 'general.menu.exportCustomerReport', icon: 'ion-document' } }
                  },
                  {
                    path: 'exportDateWiseReport',
                    data: { menu: { title: 'general.menu.exportDateWiseReport', icon: 'ion-document' } }
                  },

                ]
              },



            ]

          },
          {
            path: '',
            data: { menu: { title: 'general.menu.analyticsReport' } },
            children: [

              {
                path: 'salesVolumeReport',
                data: { menu: { title: 'general.menu.salesVolumeReport', icon: 'ion-document' } }
              },

              {
                path: 'stockAgeingReport',
                data: { menu: { title: 'general.menu.stockAgeingReport', icon: 'ion-document' } }
              },


              {
                path: 'itemAnalyserBySale',
                data: { menu: { title: 'general.menu.itemAnalyserBySale', icon: 'ion-document' } }
              },

              {
                path: 'itemAnalyserByPurchase',
                data: { menu: { title: 'general.menu.itemAnalyserByPurchase', icon: 'ion-document' } }
              },

              {
                path: 'itemAnalyserBySupplier',
                data: { menu: { title: 'general.menu.itemAnalyserBySupplier', icon: 'ion-document' } }
              },

              {
                path: 'itemAnalyserByCustomer',
                data: { menu: { title: 'general.menu.itemAnalyserByCustomer', icon: 'ion-document' } }
              },



            ],
          },

          {
            path: '',
            data: { menu: { title: 'general.menu.movementsReport' } },
            children: [

              {
                path: 'top25Volume',
                data: { menu: { title: 'general.menu.top25Volume', icon: 'ion-document' } }
              },

              {
                path: 'top25Profits',
                data: { menu: { title: 'general.menu.top25Profits', icon: 'ion-document' } }
              },
              {
                path: 'top25Revenue',
                data: { menu: { title: 'general.menu.top25Revenue', icon: 'ion-document' } }
              },
              {
                path: 'notionalProfit',
                data: { menu: { title: 'general.menu.notionalProfit', icon: 'ion-document' } }
              }

            ],
          },



        ]
      },

      {
        path: 'userManagement',
        data: { menu: { title: 'general.menu.user_management', icon: 'fa fa-users' } },
        children: [
          {
            path: 'users',
            data: { menu: { title: 'general.menu.users', icon: 'ion-person-stalker' } }
          },
          {
            path: 'roles',
            data: { menu: { title: 'general.menu.roles', icon: 'ion-ios-list-outline' } }
          }
        ]
      },

    ]
  }
]
