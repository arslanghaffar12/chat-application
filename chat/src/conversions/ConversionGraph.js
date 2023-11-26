import React, { Fragment, useState, useEffect } from "react";
import LineGraph from "../../components/charts/LineGraph";
import { graphColors } from "../../helpers/meta";

const ConversionGraph = ({ payload, properties, title }) => {
  const titles = {};
  title.forEach((item) => {
    titles[item.value] = item.label;
  });
  const colors = graphColors;
  const [data, setData] = useState([]);
  const [redraw, setRedraw] = useState(false);
  const [labels, setLabels] = useState([]);

  const makeSeries = (_data, _property, index) => {
    return {
      title: "Title_Visitors",
      label: "Label_Visitors",
      name: titles[_property],
      type: "bar",
      color: colors[index],
      data: _data,
      lineStyle: { color: colors[index], width: 4 },
      symbol: "circle",
      symbolSize: 5,
      smooth: false,
      hoverAnimation: true,
      barMaxWidth: 20,
    };
  };

  useEffect(() => {
    var _labels = [];
    var _payload = [...payload];
    _payload.forEach((row) => {
      _labels.push(row.label);
    });
    var _graphData = properties.map((property, index) => {
      var _data = [];
      _payload.forEach((row) => {
        _data.push(row[property === "unis" ? "units" : property]);
      });
      return makeSeries(_data, property, index);
    });

    setData(_graphData);
    setLabels(_labels);
    setRedraw(true);
    setTimeout(() => {
      setRedraw(false);
    }, 200);
  }, [payload, properties]);



  return (
    <Fragment>
      {redraw === false && (
        <LineGraph
          seriesData={{ data: data, labels: labels }}
          title={""}
          noHeader={true}
          hideControls
          type="bar"
          space={33}
          rotation={40}
          height={'14rem'}
        />
      )}
      {redraw === true && (
        <LineGraph
          seriesData={{ data: [], labels: labels }}
          title={""}
          noHeader={true}
          hideControls
          type="bar"
          space={33}
          rotation={40}
          height={'14rem'}

        />
      )}
    </Fragment>
  );
};

export default ConversionGraph;
