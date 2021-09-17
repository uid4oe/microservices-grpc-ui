import { Card, Grid, Image, Popup } from "semantic-ui-react";

const UserCard = ({ user, onClick }) => {
    return <Popup
        position="right center"
        content={user.greeting}
        trigger={<Card fluid onClick={onClick} key={user.id}>
            <Image src={`https://robohash.org/${user.id}.png`} ></Image>
            <Card.Content>
                <Card.Header>
                    {user.name}
                </Card.Header>
                <Card.Content>
                </Card.Content >
                <Card.Description>
                    <Grid columns={2}>
                        <Grid.Column width={6}>
                            Age
                        </Grid.Column>
                        <Grid.Column width={10} textAlign="right">
                            {user.age}
                        </Grid.Column>
                    </Grid>

                </Card.Description >
            </Card.Content >
        </Card >} />
}

export default UserCard;
