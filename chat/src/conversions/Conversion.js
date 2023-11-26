import React, { Fragment, useState, useEffect } from "react";
import { BarChart, Layout, Star, Box, List } from "react-feather";
import { Button, ButtonGroup, Card, Table, Col, Row, UncontrolledTooltip, CardBody, } from "reactstrap";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Properties from "../../components/modals/Properties";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { conversionDailyRequest, user } from "../../helpers/requests";
import MainFilter from "../../components/filters/MainFilter";
import BarGraph from "../../components/tables/BarGraph";
import { numberFormater, storage } from '../../helpers/common';
import { adlyticFormatter, capitalizeFirstLetter, numberFixed, tabStyle } from "../../helpers/utils";
import moment from "moment";
import { tablesToExcel } from "./exportTable";
import "../../App.css"
import CalendarHeatmap from "../Templates/CalendarHeatmap";
import { getDifference, reportingDateFormat } from "../../components/filters/components/FilterCommon";


const Conversion = () => {
  const [filters, setFilters] = useState();
  console.log('filters', filters);
  let tooltip;
  const [option, setOption] = useState([
    { value: "sale", label: "Sale (PKR)" },
  ]);

  const titleFromUser = user.access[0].label;

  const [allTableIds, setAllIds] = useState([]);
  const [allTableLables, setTableLabels] = useState([]);
  const [parentTable, setParentTable] = useState();
  const [allData, setAllData] = useState();
  const [sumOfTableToDownload, setSumOfTableToDownload] = useState();
  const [currentView, setCurrentView] = useState("table");
  const [options, setOptions] = useState();
  const dispatch = useDispatch();
  const raw = useSelector((state) => state.conversion.dailyData);
  const features = useSelector((state) => state.auth.features);
  const { title } = useParams();
  console.log('titletitle', title, titleFromUser);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [updateSidURL, setupdateSidURL] = useState();
  const [updateStoreNameURL, setupdateStoreNameURL] = useState();
  const [titles, setTitles] = useState((title !== undefined && title) ? title : titleFromUser);
  console.log('titlestitles', titles);
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState();
  const [sumOfTbaleToShow, setSumOfTbaleToShow] = useState()

  const mainLoader = useSelector((state) => state.highlights.loading)

  let dateFormat = "ll HH:MM";


  const storeBranchName = storage.get("storeName");
  var startDate = new Date(filters?.start);
  var endDate = new Date(filters?.end);
  var startDay = startDate.getDate();
  var startMonth = startDate.getMonth() + 1;
  var startYear = startDate.getFullYear();
  var endDay = endDate.getDate();
  var endMonth = endDate.getMonth() + 1;
  var endYear = endDate.getFullYear();
  var downloadFilename = currentStore?.label + '-' + (startDay <= 9 ? '0' + startDay : startDay) + '-' + (startMonth <= 9 ? '0' + startMonth : startMonth) + '-' + startYear + '-' + (endDay <= 9 ? '0' + endDay : endDay) + '-' + (endMonth <= 9 ? '0' + endMonth : endMonth) + '-' + endYear;
  var allDownloadFileName = "Total" + '-' + (startDay <= 9 ? '0' + startDay : startDay) + '-' + (startMonth <= 9 ? '0' + startMonth : startMonth) + '-' + startYear + '-' + (endDay <= 9 ? '0' + endDay : endDay) + '-' + (endMonth <= 9 ? '0' + endMonth : endMonth) + '-' + endYear;

  const updateFilter = (e) => {
    console.log('updateFilteree', e);
    setFilters(e);

    if (e !== undefined && e) {
      var requestData = {
        sid: e.sid,
        fid: e.fid,
        start: e.start,
        end: e?.end,
        start1: e.start1,
        end1: e?.end1,
        type: e?.type,
        dispatch
      };
      conversionDailyRequest(requestData);
    }

  };

  useEffect(() => {

    if (filters !== undefined && filters && filters.stores !== undefined && filters.stores) {
      setStores(filters.stores)
      setCurrentStore(filters.stores[0]);
    }
  }, [filters])




  useEffect(() => {

    if (title !== undefined && title) {
      setTitles(title)
    }
  }, [title])

  useEffect(() => {
    if (raw && currentStore !== undefined && currentStore && filters !== undefined && filters) {

      let _data = raw[currentStore._id];
      if (_data && _data.length) {
        let data = _data.map((row) => {


          let dateLabel = reportingDateFormat(row.date, filters);
          console.log('dateLabel',dateLabel);
          return {
            ...row,
            label: (dateLabel !== undefined && dateLabel) ? dateLabel : row.date,
            id: row.date,
            sale_updated: row.sale_updated ? moment(row.sale_updated).format('lll') : "NA",
            traffic_updated: row.traffic_updated ? moment(row.traffic_updated).format('lll') : "NA",
            sale: (Number(row.sale)),
            transaction: (Number(row.transaction)),
            units: (Number(row.units)),
            ipt: (Number(row.ipt)),
            asp: (Number(row.asp)),
            atv: (Number(row.atv)),
            conversion: (Number(row.conversion)),
          }
        });

        data = data.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        })


        console.log('dataReporting', data);
        setRawData(JSON.parse(JSON.stringify(data)));
        console.log('datadatadatadatadatadata',data);
        setData(data);
      }
      else {
        setData([])
      }
    }

  }, [raw, currentStore, filters])


  const getTables = (raw) => {
    let storesIds = Object.keys(raw).filter((key) => { return key !== "Total" });
    let _rawData = [];
    storesIds.forEach((id) => {
      let currentStore = raw[id];
      if (currentStore !== undefined && currentStore.length > 0) {
        currentStore.sort((a, b) => new Date(a.date) - new Date(b.date));
        currentStore?.forEach((row) => {
          let dateLabel = reportingDateFormat(row.date, filters);

          let _data = {
            ...row,
            label: (dateLabel !== undefined && dateLabel) ? dateLabel : row.date,
            id: row.date,
            sale_updated: row.sale_updated ? moment(row.sale_updated).format('lll') : "NA",
            traffic_updated: row.traffic_updated ? moment(row.traffic_updated).format('lll') : "NA",
            sale: "sale" in row ? adlyticFormatter(row.sale) : 0,
            transaction: 'transaction' in row ? adlyticFormatter(row.transaction) : 0,
            units: "units" in row ? adlyticFormatter(row.units) : 0,
            ipt: "ipt" in row ? adlyticFormatter(row.ipt) : 0,
            asp: "asp" in row ? adlyticFormatter(row.asp) : 0,
            atv: "atv" in row ? adlyticFormatter(row.atv) : 0,
            conversion: "conversion" in row ? adlyticFormatter(row.conversion) : 0,
            storeName: row.label,
          }
          _rawData.push(_data);
        });
      }

    })
    let tableForAllStores = <Table
      bordered
      style={{ fontSize: "14px", textAlign: "center" }}
      // id={'table1'} class="table2excel"
      id={"parentTable"}
    >
      <thead>
        <tr>
          <th>#</th>
          <th>Store Name</th>
          <th className="pointer">Label</th>
          {option.map((key, index) => {
            return (
              <th
                className="pointer select-none"
                style={{ paddingLeft: "1rem" }}
                key={"main-table-th-" + index}
              >
                {" "}
                {key.label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody style={{ borderTop: "none" }}>
        {_rawData.length > 0 && _rawData.map((row, index) => {
          return (
            <tr key={"main-table-" + index}>
              <td>{index + 1}</td>
              <td>{row.storeName}</td>
              <td>{row.label}</td>
              {option.map((key, index) => {
                return (
                  <td key={"main-table-td-" + index}>
                    {
                      row[
                      key.value === "unis" ? "units" : key.value
                      ]
                    }
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
    setParentTable(tableForAllStores);
  }

  useEffect(() => {
    if (raw && filters !== undefined && filters) {

      let object = {};
      let ids = Object.keys(raw).map((key) => { return key });
      let _ids = JSON.parse(JSON.stringify(Object.keys(raw).map((key) => { return key })));
      const dataOfAllStores = getTables(raw)
      let tableByTotal = [];

      if (filters !== undefined && filters && "start" in filters) {
        var endDate = moment(filters?.end).format('YYYY-MM-DD');
        var startDate = moment(filters?.start).format('YYYY-MM-DD');
        for (let i = new Date(endDate); i >= new Date(startDate); i.setDate(i.getDate() - 1)) {
          var currentDate = moment(i).format('YYYY-MM-DD');
          let dataOfSameDate = [];
          ids.forEach((id) => {
            let _data = raw[id];
            let dataWithDate = _data.filter((row) => row.date === currentDate)[0];
            if (dataWithDate !== undefined && dataWithDate) {
              dataOfSameDate.push(dataWithDate);
            }
          })

          console.log('dataOfSameDate',dataOfSameDate);





          const sumOfData = dataOfSameDate.reduce((acc, curr) => {
            if (acc !== undefined && acc) {
              for (const [key, value] of Object.entries(curr)) {
                if (key !== 'date') {
                  acc[key] ??= 0;
                  acc[key] += value;
                }
                else {
                  acc[key] = value;
                  acc['label'] = value

                }
              }
            }
            return acc;
          }, {});
          console.log('sumOfData',sumOfData);
          if (Object.keys(sumOfData ? sumOfData : {}).length > 0) {
            tableByTotal.push(sumOfData);
          }
        }
      }
      let dataByTotalSort = tableByTotal.sort((a, b) => {
        return new Date(a.label) - new Date(b.label);
      })

      dataByTotalSort = dataByTotalSort.map((item, index) => {
        let obj = {
          ...item,
          conversion : (item.transaction / item.total) * 100,
          atv : item.sale/item.transaction,
          asp : item.sale/item.units,
          ipt : item.units/item.transaction,
        }
        return obj
      })


      let label = Object.keys(raw).map((key) => { return raw[key][0]?.label });
      label.push(['Total'])
      let idsWithTotal = ids.slice();
      idsWithTotal.push(['Total'])
      raw['Total'] = dataByTotalSort;
      console.log('rawraw',raw);
      setAllIds(idsWithTotal)
      setTableLabels(label);
      idsWithTotal.forEach((id) => {
        let _data = raw[id];

        if (_data !== undefined && _data.length > 0) {


          let data = _data?.map((row) => {

            let dateLabel = reportingDateFormat(row.date, filters);


            let newRow = {
              ...row,
              label: (dateLabel !== undefined && dateLabel) ? dateLabel : row.date,
              id: row.date,
              sale_updated: row.sale_updated ? moment(row.sale_updated).format('lll') : "NA",
              traffic_updated: row.traffic_updated ? moment(row.traffic_updated).format('lll') : "NA",
              sale: "sale" in row ? (row.sale) : 0,
              transaction: 'transaction' in row ? (row.transaction) : 0,
              units: "units" in row ? (row.units) : 0,
              ipt: "ipt" in row ? (row.ipt) : 0,
              asp: "asp" in row ? (row.asp) : 0,
              atv: "atv" in row ? (row.atv) : 0,
              conversion: "conversion" in row ? (row.conversion) : 0,
            }


            return newRow
          });



          data = data.sort((a, b) => {
            return new Date(a.label) - new Date(b.label);
          })
          object[id] = data;
        }
      })
      setAllData(object);

      const allTable = idsWithTotal.map((id, index) => {
        return (
          <Table
            bordered
            style={{ fontSize: "14px", textAlign: "center" }}
            // id={'table1'} class="table2excel"
            id={id}
          >
            <thead>
              <tr>
                <th>#</th>
                <th className="pointer">Label</th>
                {option.map((key, index) => {
                  return (
                    <th
                      className="pointer select-none"
                      style={{ paddingLeft: "1rem" }}
                      key={"main-table-th-" + index}
                    >
                      {" "}
                      {key.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody style={{ borderTop: "none" }}>
              {id in object && object[id].length > 0 && object[id].map((row, index) => {

                console.log('rowrowrow', row);
                return (
                  <tr key={"main-table-" + index}>
                    <td>{index + 1}</td>
                    <td>{row.label}</td>
                    {option.map((key, index) => {
                      console.log("currentKey :", key, key.value);
                      let currentValue = adlyticFormatter(row[key.value === "unis" ? "units" : key.value]);
                      console.log('currentValue', key.value, row, currentValue);


                      return (
                        <td key={"main-table-td-" + index}>
                          {
                            adlyticFormatter(row[
                              key.value === "unis" ? "units" : key.value
                            ])
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )
      })
      setSumOfTbaleToShow(allTable[allTable.length - 1])
      setSumOfTableToDownload(allTable);
    }

  }, [raw, filters])




  const [properties, setProperties] = useState([]);


  useEffect(() => {
    setProperties(option == null ? [] : option.map((opt) => opt.value));
  }, [option]);

  useEffect(() => {
    let allOptions = [...features.footfall, ...features.sales];
    setOption(allOptions);
    setOptions(allOptions);
  }, [features]);



  const summaryMenu = [
    ["leader", <List size={16} />, "Leader Board"],
    ["table", <Layout size={16} />, "Tabular View"],
    ["bar", <BarChart size={16} />, "Bar Board"],
    ["calendarHeatmap", <Box size={16} />, "Leader Board"],

  ];



  useEffect(() => {
    if (updateStoreNameURL) {
      setTitles(updateStoreNameURL);
    }
  }, [updateStoreNameURL]);

  useEffect(() => {
    if (stores.length > 0 && currentView !== "table") {
      if (typeof currentStore !== undefined && currentStore && currentStore.label === "Total") {
        setCurrentStore(stores[0])
      }
    }
  }, [currentView])






  return (
    <Fragment>
      <MainFilter
        // pageTitle="Conversion"
        Title={titles}
        pageTitle={'Report'}
        updateStoreNameURL={titles}
        updateFilter={(e) => updateFilter(e)}
        type="brown"
      />


      <Row className="mb-4 setDownloadBtn">
        {option && options && (
          <>
            <Col className="text-start">
              <Properties
                option={option}
                options={options}
                setOption={(e) => setOption(e)}
                flag={'feature'}
              />
              {
                stores && stores.length > 1 && currentView === "table" &&
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className={stores.length === 1 ? " mx-2 btn btn-sm btn-outline-primary" : "  btn btn-sm btn-outline-primary"}
                  table={"parentTable"}
                  filename={allDownloadFileName}
                  sheet={"Total"}
                  buttonText={`Download All`}
                />
                // <button className="btn btn-sm btn-outline-primary mx-2" onClick={() => tablesToExcel(allTableIds, allTableLables, 'Stores.xls', 'Excel')}>Download All</button>

              }
              {currentView === "table" &&
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className={" mx-2 btn btn-sm btn-outline-primary"}
                  table={currentStore?.label === "Total" ? "Total" : "table-to-xls"}
                  filename={downloadFilename}
                  sheet={currentStore?.label}
                  buttonText={`Export ${currentStore?.label}`}
                />
              }
            </Col>

          </>

        )}
        <Col className="text-end">
          <ButtonGroup>
            {summaryMenu.map((val, index) => {
              return (
                <Button
                  href={"#toggle-tab-" + val[0]}
                  color={
                    currentView === val[0] ? "outline-primary" : "outline-light"
                  }
                  className="section-tab"
                  size="sm"
                  onClick={function noRefCheck() {
                    setCurrentView(val[0]);
                  }}
                  active={currentView === val[0] ? true : null}
                  key={"compare-tab-" + index}
                  id={"toggle-tooltip-" + val[0]}
                >
                  {val[1]}
                </Button>
              );
            })}
          </ButtonGroup>
          {summaryMenu.map((val, index) => {
            return (
              <UncontrolledTooltip
                flip
                isOpen={val[0] === tooltip}
                autohide={false}
                placement="top"
                target={"toggle-tooltip-" + val[0]}
                key={"compare-tab-tooltip-" + index}
              >
                {val[2]}
              </UncontrolledTooltip>
            );
          })}
        </Col>
      </Row>
      {stores && stores.length > 1 && <Card className="my-4" style={{ backgroundColor: "" }}>
        <Row>
          <Col
            className="h-100 align-middle px-4 text-right"
            style={{ height: "64px", overflowX: 'scroll', width: '100%' }}
            id='style-horizontal'
          >
            <ButtonGroup size="sm" style={{ borderRadius: "0px", overflowX: '', width: '' }} className='' id="">

              {currentStore?.label !== undefined && currentStore?.label && stores && stores.length > 0 &&
                <>
                  {currentView === 'table' && <Button
                    style={tabStyle("Total", currentStore?.label)}
                    onClick={() => setCurrentStore({ label: 'Total' })}
                    className='force-overflow-horizontal'
                  >
                    {"Total"}
                  </Button>
                  }
                  {
                    stores.map((store) => {
                      return (
                        <Button
                          style={tabStyle(store.label, currentStore?.label)}
                          onClick={() => setCurrentStore(store)}
                          className='force-overflow-horizontal'
                        >
                          {store.label}
                        </Button>
                      )
                    })
                  }
                </>
              }

            </ButtonGroup>
          </Col>
        </Row>
      </Card>}


      <div style={{ display: 'none' }}>
        {sumOfTableToDownload}
      </div>
      {currentStore?.label === "Total" &&
        <>
          {sumOfTbaleToShow}
        </>

      }
      <div style={{ display: 'none' }}>
        {parentTable}
      </div>



      <div style={{ minHeight: "500px",overflow:"scroll" }}>
        {currentView === "table" && option && (

          <Row className="mb-4 tableSetCss" id={"#toggle-tab-" + currentView}>
            <Col>
              <Card style={{ border: "none" }}>

                {currentStore?.label !== "Total" && <Table
                  bordered
                  style={{ fontSize: "14px", textAlign: "center" }}
                  // id={'table1'} class="table2excel"
                  id={"table-to-xls"}
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="pointer">Label</th>
                      {option.map((key, index) => {
                        return (
                          <th
                            className="pointer select-none"
                            style={{ paddingLeft: "1rem" }}
                            key={"main-table-th-" + index}
                          >
                            {" "}
                            {key.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  {data !== undefined && data && data.length > 0 && !mainLoader && <tbody style={{ borderTop: "none" }}>
                    {data.map((row, index) => {
                      return (
                        <tr key={"main-table-" + index}>
                          <td>{index + 1}</td>
                          <td>{row.label}</td>
                          {option.map((key, index) => {
                            return (
                              <td key={"main-table-td-" + index}>
                                {
                                  adlyticFormatter(row[
                                    key.value === "unis" ? "units" : key.value
                                  ])
                                }
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>}
                </Table>}
                <CardBody
                  style={{ minHeight: '6.75rem', height: 'auto', }}
                >
                  {currentStore?.label !== 'Total' && !mainLoader && !data.length && <span className='className="d-block small opacity-50"'><i>No data on selected date. Please select another date</i></span>}

                  <div className="container h-100">
                    <div className="row align-items-center h-100">
                      <div className="col-6 mx-auto">
                        <div className="jumbotron">
                          {mainLoader && <span className="d-block small opacity-30 text-center align-middle "><i>Data Fetching...</i></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
        {currentView === "bar" && option && (
          <Row className="mb-4" id={"#toggle-tab-" + currentView}>
            <Col>
              <BarGraph
                dataOptions={option}
                title={options}
                payload={rawData}
                properties={properties}
                sortFlag={false}

              />
            </Col>
          </Row>
        )}
        {currentStore?.label !== "Total" &&
          currentView === "calendarHeatmap" && option &&


          <>
            <CalendarHeatmap
              dataOptions={option}
              title={options}
              payload={rawData}
              data={data}
              properties={properties}
              filters={filters}
              anually={true}
              monthly={true}
              weekly={true}
              view={'single'}
              heatmapView={'horizontal'}
            />
          </>
        }
      </div>

    </Fragment>
  );
};

export default Conversion;
