import React, { Fragment, useState, useEffect } from "react";
import { BarChart, Layout } from "react-feather";
import { Button, ButtonGroup, Card, Table, Col, Row, UncontrolledTooltip} from "reactstrap";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Properties from "../../components/modals/Properties";
import { useSelector, useDispatch } from "react-redux";
import { conversionDailyRequest , user} from "../../helpers/requests";
import MainFilter from "../../components/filters/MainFilter";
import BarGraph from "../../components/tables/BarGraph";
import { numberFormater, storage } from '../../helpers/common';

const Reporting = () => {
  const [filters, setFilters] = useState();
  const [option, setOption] = useState([
    { value: "sale", label: "Sale (PKR)" },
  ]);
  let tooltip;
  const title = user.access[0].label;
  const [titles, setTitles] = useState();
  const [currentView, setCurrentView] = useState("table");
  const [options, setOptions] = useState();
  const dispatch = useDispatch();
  const raw = useSelector((state) => state.conversion.dailyData);
  const features = useSelector((state) => state.auth.features);
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]);

  const storeBranchName =  storage.get("storeName");
  var startDate = new Date(filters?.start); 
  var endDate = new Date(filters?.end); 
  
  var startDay = startDate.getDate();
	var startMonth = startDate.getMonth() + 1;
	var startYear = startDate.getFullYear();
  var endDay = endDate.getDate();
	var endMonth = endDate.getMonth() + 1;
	var endYear = endDate.getFullYear();
  var downloadFilename = storeBranchName +'-'+ (startDay <= 9 ? '0' + startDay : startDay) + '-' + (startMonth <= 9 ? '0' + startMonth : startMonth) + '-' + startYear + '-' +(endDay <= 9 ? '0' + endDay : endDay) + '-' + (endMonth <= 9 ? '0' + endMonth : endMonth) + '-' + endYear ;

  const updateFilter = (e) => {
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

    // var requestData = {
    //   params: {
    //     sid: [e?.sid],
    //     fid: [e?.fid],
    //     start: e?.start,
    //     end: e?.end,
    //   },
    //   dispatch: dispatch,
    // };
    // conversionDailyRequest(requestData);
  };
  const getSalesData = () => {
    var requestData = {
      params: {
        sid: [filters?.sid],
        fid: filters?.fid,
        start: filters?.start,
        end: filters?.end,
      },
      dispatch: dispatch,
    };
    conversionDailyRequest(requestData);
  };

  useEffect(() => {
    if (filters) {
      setTimeout(() => {
        getSalesData();
      }, 100);
    }
  },[]);

  useEffect(() => {
    setRawData(JSON.parse(JSON.stringify(raw)));
    const element = {};
    var _data = raw.map((element) => {
      element.sale = numberFormater(parseInt(element.sale));
      element.transaction = numberFormater(parseInt(element.transaction));
      element.units = numberFormater(parseInt(element.units));
      element.ipt = numberFormater(parseInt(element.ipt));
      element.atv = numberFormater(parseInt(element.atv));
      element.asp = numberFormater(parseInt(element.asp));
      element.conversion = element.conversion + "%";
      return element;
    });
    // _data.shift();
    setData(_data);
  }, [raw]);

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
    ["table", <Layout size={16} />, "Tabular View"],
    ["bar", <BarChart size={16} />, "Bar Board"],
  ];

  return (
    <Fragment>
      <MainFilter
        pageTitle="Reporting"
        updateStoreNameURL={title}
        updateFilter={(e) => updateFilter(e)}
        type="brown"
      />
      <Row>
      </Row>
      <Row className="mb-4">
        {option && options && (
          <Col className="text-start">
            <Properties
              option={option}
              options={options}
              setOption={(e) => setOption(e)}
              flag={'feature'}
            />
            {currentView === "table"&&
            <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-sm btn-outline-primary mx-2"
            table="table-to-xls"
            filename={downloadFilename}
            sheet="tablexls"
            buttonText="Export to Excel"
          />
            }
            
          </Col>
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

      <div style={{ minHeight: "500px" }}>
        {currentView === "table" && option && (
          <Row className="mb-4" id={"#toggle-tab-" + currentView}>
            <Col>
              <Card style={{ border: "none" }}>
                <Table
                  bordered
                  style={{ fontSize: "14px", textAlign: "center" }}
                  id="table-to-xls"
                >
                  <thead>
                    <tr>
                      <th className="pointer">Label</th>
                      {option.map((key, index) => {
                        return (
                          <th
                            className="pointer select-none"
                            style={{ paddingLeft: "1rem" }}
                            key={"main-table-th-" + index}
                          >
                            {key.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "none" }}>
                    {data.map((row, index) => {
                      return (
                        <tr key={"main-table-" + index}>
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
      </div>
    </Fragment>
  );
};

export default Reporting;
