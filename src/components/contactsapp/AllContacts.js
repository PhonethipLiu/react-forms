import React, { Component } from 'react';
import { Card, Button, Image, Divider, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AddForm from './AddForm';
export default class AllContacts extends Component {

    state = {
        contacts:[],
        addContact: false,
    }

    componentDidMount(){
        const storedUser = sessionStorage.getItem("user");
        
        if(storedUser){
            const storedUserObj = JSON.parse(storedUser);
            this.loadContacts(storedUserObj.id)
        }else{
            this.loadContacts(this.props.user.id)
        }  
    }


    loadContacts = (id) => {
        fetch(`http://localhost:4000/contacts?ownerID=${id}`)
        .then((data)=>{
            return data.json();
        }).then((userContacts)=>{
            this.setState({
                contacts: userContacts
            })
            console.log(userContacts)
        })
    }

    /* CRUD save & update; Resets the state of the data to re-render the object/component to DOM */
    saveUpdate = (userObject) => {
        userObject.ownerID = this.props.user.id
        fetch(`http://localhost:4000/contacts/`,
        { method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userObject)
        })
        .then((response)=>{
            return response.json();
        }). then ((data)=>{
            this.setState({
                // contact: data,
                addContact: false,
            })
            this.loadContacts(this.props.user.id)
        })
    }

    /* Shows the form when the addContact button is clicked */
    addContact = () => {
        this.setState({
            addContact: true,
        })
    }

    cancelUpdate = () => {
        this.setState({
            addContact: false,
        })
    }

    deleteContact = (id) =>{
        return fetch(`http://localhost:4000/contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'COntent-Type': 'application/json'
            }
        }).then((response) => {
            const storedUser = sessionStorage.getItem('user');
            const storedUserObj = JSON.parse(storedUser);
            /* loads the contacts so it can re-render in the dom */
            this.loadContacts(storedUserObj.id);
        })
    }

    openForm = () => {
        if(this.state.addContact){
            return(
                <div> 
                    <Divider section />
                        <AddForm 
                            title='Add contact'
                            saveUpdate={this.saveUpdate}
                            cancelUpdate={this.cancelUpdate} 
                        />
                    <Divider section />
                </div>
            )
        } else {
            return(
            <div>
                    <Button 
                        color='green' 
                        onClick={this.addContact}
                    >
                    <Icon name='add user' />
                        Add Contact
                    </Button>
                    <Divider section />
                </div>
            )
        }
    }


    render () {
        return(
            <div>
                {this.openForm()}
                <h1> All Contacts </h1>
                <ContactsList contacts={this.state.contacts} deleteContact={this.deleteContact}/>
            </div>
        )
    }
} 


class ContactsList extends Component{
    render(){
        const contacts = this.props.contacts.map((contact)=>(
            <CardExampleHeaderCard
                key={contact.id}
                id={contact.id}
                name={contact.name}
                company={contact.company}
                notes={contact.notes}
                image={contact.image}
                rating={contact.rating}
                phone={contact.phone}
                deleteContact={this.props.deleteContact}
                email={contact.email}
            />
        ));
        return(
            <div>
                <Card.Group>
                    {contacts}
                </Card.Group>
            </div>
        )
    }

}

/* Short Card Group */
// const CardExampleHeaderCard = (props) => (
//   <Card.Group>
//     <Card>
//       <Card.Content>
//         <Card.Header>{props.name}</Card.Header>
//         <Card.Meta>{props.company}</Card.Meta>
//         <Card.Description>{props.notes}</Card.Description>
//       </Card.Content>
//     </Card>
//   </Card.Group>
// )

class CardExampleHeaderCard extends Component{
    render(){
        return(
            <Card>
                <Card.Content>
                    <Image floated='right' size='mini' src={this.props.image} />
                    <Card.Header>
                    <Link to={`/contactsapp/${this.props.id}`}>{this.props.name} ({this.props.company}) </Link>
                    </Card.Header>

                    <Card.Meta>  
                    <Button 
                        size='mini' 
                        color='red'
                        onClick={()=>{this.props.deleteContact(this.props.id)}}
                        >
                        Delete Contact                       
                    </Button>
                    </Card.Meta>

                    <Card.Description>
                    <strong>{this.props.notes}</strong>
                    </Card.Description>
                </Card.Content>

                <Card.Content extra>
                    <div className='ui four buttons'>
                    <Button basic color='green' icon="call" href={`tel:${this.props.phone}`}></Button>
                    <Button basic color='green' icon="talk" href={`sms:${this.props.phone}`}></Button>
                    <Button basic color='blue' icon="mail" href={`mailto:${this.props.email}`}></Button>
                    <Button basic color='orange' as={Link} to={`/contactsapp/${this.props.id}`}>Edit</Button>
                    </div>
                </Card.Content>
            </Card>
        )
    }
}