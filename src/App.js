import { useState, createContext } from "react";
import { Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom";
import { Button, Card, Grid, Header, Menu, Popup } from "semantic-ui-react";
import MainPage from "./pages/main-page"
import { ADVICES, PROTOCOL, USERS, HOSTS, PORTS } from "./configuration";
export const BackendContext = createContext(null);

function App() {

  const history = useHistory();
  const location = useLocation();

  const backendList = ["Go", "Kotlin", "Java"];

  const backendConfig = [
    {
      users: PROTOCOL + HOSTS[0] + PORTS[0] + USERS,
      advices: PROTOCOL + HOSTS[0] + PORTS[0] + ADVICES,
      active: 0,
    },
    {
      users: PROTOCOL + HOSTS[0] + PORTS[1] + USERS,
      advices: PROTOCOL + HOSTS[0] + PORTS[1] + ADVICES,
      active: 1,
    },
    {
      users: PROTOCOL + HOSTS[0] + PORTS[2] + USERS,
      advices: PROTOCOL + HOSTS[0] + PORTS[2] + ADVICES,
      active: 2,
    },
  ]

  const index = backendList.map(i => i.toUpperCase()).indexOf(location.pathname.substring(1).toUpperCase());
  const [backend, setBackend] = useState(backendConfig[Math.max(index, 0)]);

  // HOSTS = local,go,kt,java
  const changeBackend = (e, { name }) => {
    setBackend(
      backendConfig[name]
    );
    history.push(backendList[name].toLowerCase())
  }

  return (
    <Grid columns={3} >
      <Grid.Column width={1} />
      <Grid.Column width={14}>
        <Grid columns={2}>
          <Grid.Row>
            <Card fluid style={{ borderRadius: "0 0 1em 1em" }}>
              <Card.Content>
                <Card.Header>
                  <Grid verticalAlign="middle">
                    <Grid.Column width={4}>
                      <Header size="large">
                        Microservices gRPC
                      </Header>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Popup inverted open positionFixed position="right center" trigger={<Menu fluid widths={3} size="huge" compact>

                        {backendList.map((item, index) =>
                          <Menu.Item
                            style={index == backend.active ? { background: "#2185d0", color: "white" } : {}}
                            active={index == backend.active}
                            onClick={changeBackend}
                            name={index}>
                            {item}
                          </Menu.Item>
                        )}
                      </Menu>}>Click to change backend!</Popup>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign="right">
                      <Button
                        size="huge"
                        icon="github"
                        color="blue"
                        role="a"
                        target="_blank"
                        href="https://github.com/uid4oe/"
                      ></Button>
                      <Button
                        size="huge"
                        icon="linkedin"
                        color="blue"
                        role="a"
                        target="_blank"
                        href="https://www.linkedin.com/in/uid4oe/"
                      ></Button>
                    </Grid.Column>
                  </Grid>
                </Card.Header>
              </Card.Content>
            </Card>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <BackendContext.Provider value={backend}>
                <Switch>
                  <Route exact path="/go" component={() => MainPage()} />
                  <Route exact path="/kotlin" component={() => MainPage()} />
                  <Route exact path="/java" component={() => MainPage()} />
                  <Redirect from="/" to="/go" />
                </Switch>
              </BackendContext.Provider>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
      <Grid.Column width={1} />
    </Grid >
  );
}

export default App;
