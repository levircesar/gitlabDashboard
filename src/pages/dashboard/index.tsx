import { useState, useEffect } from "react";
import "./styles";
import { Container, FlexCenter } from "./styles";
import { dados } from "../../utils/dados";
import { Select, Button, Switch } from "antd";
import axios from "axios";
import { Gauge } from "@ant-design/plots";
const { Option } = Select;

function Dashboard() {
  const [sistemas, setSistemas] = useState([]);
  const [sistemaSelected, setSistemaSelected] = useState(null);
  const [repo, setRepo] = useState(null);
  const [fork, setFork] = useState(false);
  const maxSize = 1000;
  const config = {
    percent: repo?.size / maxSize ,
    radius: 0.75,
    range: {
      color: "#30BF78",
      width: 12,
    },
    indicator: {
      pointer: {
        style: {
          stroke: "#30BF78",
        },
      },
      pin: {
        style: {
          stroke: "#D0D0D0",
        },
      },
    },
    statistic: {
      content: {
        formatter: ({ percent }) => `Rate: ${(percent * 100 ).toFixed(0)}%`,
      },
      style: {
        fontSize: 60,
      },
    },
    gaugeStyle: {
      lineCap: "round",
    },
  };
  useEffect(() => {
    const getSistemas = async () => {
      const { data } = await axios.get(
        "https://api.github.com/users/levircesar/repos"
      );
      setSistemas(data);
    };
    getSistemas();
  }, []);

  useEffect(() => {
    const filteredData = sistemas.filter((item) => item.fork === fork )
    console.log(filteredData)
  } , [fork])

  const getRepo = async (url) => {
    const { data } = await axios.get(url);
    if (data) {
      setRepo(data);
      console.log(data.size)
    }
      
  };



  return (
    <Container>
      <FlexCenter>
        <Select
          style={{ width: "150px" }}
          showSearch
          placeholder="Select system"
          optionFilterProp="children"
          onChange={(e) => getRepo(e)}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {sistemas.map((item) => (
            <Option key={item.id} value={item.url}>
              {item.name}
            </Option>
          ))}
        </Select>

        <Switch  onChange={(e)=>setFork(e)} />

        <Button onClick={() => console.log(repo)}>Show fork projects</Button>
      </FlexCenter>

        {repo &&  <Gauge {...config} />}
     
    </Container>
  );
}

export default Dashboard;
