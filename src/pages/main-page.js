import { createContext, useContext, useEffect, useState } from "react";

import { Button, Grid, Card, Message, Segment, Dimmer, Loader, Header, Label } from "semantic-ui-react";
import { BackendContext } from "../App";
import SelectedUserCard from "../components/selected-user-card-component";
import UserCard from "../components/user-card-component";
import { DEFAULT_USER, SERVICES_DOWN } from "../configuration";
export const UpdateContext = createContext(null);

const MainPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ ...DEFAULT_USER, newUser: true });
  const [users, setUsers] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [responseTime, setResponseTime] = useState(0);

  const backend = useContext(BackendContext);

  const onGetRandomClick = () => {
    users?.length && setSelectedUser(users[Math.floor(Math.random() * users.length)])
  };

  const onGetAll = async () => {
    setLoaded(false);
    setError(false);
    setResponseTime(0);

    try {
      const startTime = new Date();
      const response = await fetch(backend.users);
      const endTime = new Date();
      const { data, error } = await response.json()

      if (!response.ok) {
        setUsers([])
        setError(error)
      } else {
        setUsers(data?.reverse())
      }
      setLoaded(true)
      setResponseTime(endTime - startTime)
    }
    catch (e) {
      setLoaded(true)
      setError(SERVICES_DOWN)
    }
  }


  useEffect(() => {
    onGetAll();
  }, [backend, updated])


  useEffect(() => {
    setSelectedUser({ ...DEFAULT_USER, newUser: true })
  }, [backend])

  return (
    <UpdateContext.Provider value={[updated, setUpdated]}>
      <Grid columns={2}>
        <Grid.Column width={8}>
          <Card fluid>
            <Card.Content>
              <Button.Group fluid widths={8}>
                <Button
                  icon="add"
                  content="Add One"
                  color="green"
                  onClick={() => setSelectedUser(DEFAULT_USER)}
                ></Button>
                <Button.Or />
                <Button
                  icon="random"
                  content="Get Random"
                  color="orange"
                  onClick={onGetRandomClick}
                ></Button>
              </Button.Group>
            </Card.Content>

            <Card.Content>

              <SelectedUserCard user={selectedUser} />
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={8}>
          <Card fluid>
            <Card.Content>
              <Header>
                Get Users
                <Label>
                  {responseTime} ms
                </Label>
              </Header>
            </Card.Content>
            {error ? <Card.Content extra>
              <Message
                info
                icon="info circle"
                header={error}
              />
            </Card.Content> :
              <Card.Content extra>
                {loaded ?
                  <>
                    {users?.length ?
                      <Card.Group itemsPerRow={5} style={{ overflow: "auto", maxHeight: "600px" }}>
                        {users.map(item => <UserCard user={item} onClick={() => setSelectedUser(item)} />)}
                      </Card.Group> : <>No data</>}
                  </>
                  :
                  <Segment>
                    <Dimmer active inverted>
                      <Loader inverted content='Loading' size="medium" />
                    </Dimmer>
                    <div style={{ height: "200px" }}></div>
                  </Segment>
                }
              </Card.Content>}
          </Card>
        </Grid.Column>
      </Grid>
    </UpdateContext.Provider>
  );
};

export default MainPage;
