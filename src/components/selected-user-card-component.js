import { useContext, useEffect, useState } from "react";
import { Button, Card, Dimmer, Form, Grid, Header, Icon, Image, Label, Loader, Message, Popup, Segment } from "semantic-ui-react";
import { UpdateContext } from "../pages/main-page";
import { EXTERNAL_ADVICE_API, HEADERS, images } from "../configuration";
import { BackendContext } from "../App";

const emptyAdvice = { advice: "", cached: false };

const SelectedUserCard = ({ user }) => {
    const [values, setValues] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);
    const [error, setError] = useState(false);
    const [responseTime, setResponseTime] = useState(0);
    const [adviceResponseTime, setAdviceResponseTime] = useState(0);
    const [calledResource, setCalledResource] = useState("");
    const [remoteAdvice, setRemoteAdvice] = useState(emptyAdvice);

    const backend = useContext(BackendContext);

    const newUser = user?.newUser;

    const getRemoteAdvice = async () => {
        const response = await fetch(EXTERNAL_ADVICE_API);
        if (response.ok) {
            const { slip: { advice } } = await response.json();
            return advice
        }
    }

    const updateCurrentAdvice = (data) => {
        setRemoteAdvice({ advice: data, cached: true })
        setTimeout(() => setRemoteAdvice({ ...remoteAdvice, cached: false }), 2000)
    }

    if (newUser && remoteAdvice?.advice?.length === 0) {
        getRemoteAdvice().then((data) => setRemoteAdvice({ advice: data, cached: false }));
    }

    const [updated, setUpdated] = useContext(UpdateContext)

    useEffect(() => {
        setResponseTime(0);
        setCardLoading(false);
        setError(false);

        const getDetails = async () => {
            setCardLoading(true);
            const startTime = new Date();
            const response = await fetch(`${backend.users}${user.id}`);
            const endTime = new Date();

            const { data, error } = await response.json()

            if (!response.ok) {
                setValues(null)
                setError(error)
                setTimeout(() => setError(false), 1500)
            } else {
                setValues({ ...user, ...data })
            }
            setResponseTime(endTime - startTime)
            setCardLoading(false)

        }
        if (newUser) {
            setCalledResource("Create User");
            setValues(user)
        } else {
            setCalledResource("Get User Details")
            getDetails()
        }
    }, [user, newUser]);

    const submitForm = async () => {
        setLoading(true)
        setError(false)
        setResponseTime(0)

        const url = newUser ? backend.users : backend.users + values.id;
        const method = newUser ? "POST" : "PUT";
        !newUser && setCalledResource("Update User");
        const startTime = new Date();

        const response = await fetch(url,
            {
                body: JSON.stringify({ ...values, age: Number(values.age), salary: Number(values.salary), advice: remoteAdvice.advice }),
                method: method,
                ...HEADERS
            }
        )
        const endTime = new Date();
        if (!response.ok) {
            const { error } = await response.json()
            setError(error)
            setTimeout(() => setError(false), 1500)
        } else {
            setRemoteAdvice(emptyAdvice);
            setUpdated(!updated)
        }
        setLoading(false)
        setResponseTime(endTime - startTime)

    }

    const submitAdviceUpdate = async (data) => {
        setAdviceResponseTime(0)
        setError(false)

        const startTime = new Date();
        const response = await fetch(backend.advices,
            {
                body: JSON.stringify({ user_id: values.id, advice: data }),
                method: "PUT",
                ...HEADERS
            }
        )
        const endTime = new Date();
        if (!response.ok) {
            const { error } = await response.json()
            setError(error)
            setTimeout(() => setError(false), 1500)
        }
        setAdviceResponseTime(endTime - startTime)
    }

    return <Grid columns={2}>
        {!cardLoading ?
            <Grid.Row>
                <Grid.Column width={16}>
                    <Header style={{ paddingBottom: "1em" }}>
                        {calledResource}
                        <Label>
                            {responseTime} ms
                        </Label>
                    </Header>
                </Grid.Column>
                {error &&
                    <Grid.Column width={16}>
                        <Message header={error} info icon="info circle" style={{ zIndex: 9999 }} />
                        <br />
                    </Grid.Column>
                }
                {values &&
                    <Grid.Column width={9}>
                        <Form onSubmit={submitForm}>
                            {Object.keys(values).slice(1, 4).map(key => <Form.Field key={key}>
                                <label>{key.at(0).toUpperCase() + key.slice(1)}</label>
                                <input name={key} value={values[key]} onChange={({ target }) => setValues({ ...values, [target.name]: target.value })} />
                            </Form.Field>)}
                            {Object.keys(values).slice(4, 6).map(key => <Form.Field key={key}>
                                <label>{key.at(0).toUpperCase() + key.slice(1)} <Label color="red" size="tiny" style={{ marginLeft: "0.5em" }}>Secret Value</Label></label>
                                <input name={key} value={values[key]} onChange={({ target }) => setValues({ ...values, [target.name]: target.value })} />
                            </Form.Field>)}
                            <Form.Button primary content="Submit" loading={loading} />
                        </Form>
                    </Grid.Column>
                }
                <Grid.Column width={7}>
                    <Grid columns={2}>
                        <Grid.Column width={10}>
                            {!newUser && values &&
                                <><Card fluid>
                                    <Image src={`https://robohash.org/${values.id}.png`} ></Image>
                                </Card>
                                </>
                            }</Grid.Column>
                        <Grid.Column width={6} textAlign="center">
                            {values && <><Popup inverted open positionFixed position="top right" trigger={<Card fluid>
                                <Image size="huge" src={images[backend.active]}></Image>
                                <Popup position="right center" open={remoteAdvice?.cached} openOnTriggerMouseEnter={false} trigger={
                                    <Button disabled={remoteAdvice?.cached || newUser} primary onClick={() => {
                                        getRemoteAdvice().then((data) => {
                                            updateCurrentAdvice(data);
                                            setValues({ ...values, advice: data })
                                            submitAdviceUpdate(data)
                                        })

                                    }} >
                                        <Icon name="random" fitted />
                                    </Button>
                                }>
                                    Disabled until <b>External API's request cache expires</b> (2 seconds)
                                </Popup>
                            </Card>
                            }>
                                {values?.advice ? values.advice : "Create a new user for my advice"}
                            </Popup>
                                <Header style={{ marginBottom: "0.2em", marginTop: "0" }}>Update Advice</Header>
                                <Label>
                                    {adviceResponseTime} ms
                                </Label>
                            </>}
                        </Grid.Column>
                    </Grid>
                </Grid.Column>

            </Grid.Row> :
            <Grid.Row>
                <Grid.Column width={16}>
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted content='Loading' size="medium" />
                        </Dimmer>
                        <div style={{ height: "200px" }}></div>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        }
    </Grid >
}

export default SelectedUserCard;
