import React from 'react';

import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap';

import {Link} from 'react-router-dom';
import {showService} from 'requests/services';
import Breadcrumbs from 'components/Breadcrumbs';
import Loader from 'components/Loader';

class Component extends React.Component {
  state = {
    isLoading: false,
    isLoaded: false,
    isNotFound: false,
    data: {},
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      this.setState({isLoading: true});
      const {id} = this.props.match.params;
      const {data} = await showService(id);
      this.setState({
        isLoading: false,
        isNotFound: false,
        data,
        isLoaded: true,
      });
    } catch (error) {
      this.setState({isLoading: false, isNotFound: true});
    }
  };

  get previous() {
    return [
      {
        to: '/services',
        label: 'Servicios',
      },
    ];
  }

  render() {
    if (!this.state.isLoaded) return <Loader show />;
    const {id} = this.props.match.params;
    const {name, description, status, created_at, updated_at} = this.state.data;
    return (
      <React.Fragment>
        <Breadcrumbs previous={this.previous} active="Servicio Información" />
        <Card>
          <CardBody className="position-relative">
            {this.state.isNotFound && 'Page Not Found'}
            <Form>
              <FormGroup>
                <Label for="Name">Nombre</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  required
                  defaultValue={name}
                  readOnly={true}
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Descripción</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  required
                  defaultValue={description}
                  readOnly={true}
                />
              </FormGroup>

              <FormGroup>
                <Label for="status">Estatus</Label>
                <Input
                  type="text"
                  name="status"
                  id="status"
                  required
                  defaultValue={status}
                  readOnly={true}
                />
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="created_at">Creado</Label>
                    <Input
                      type="text"
                      name="created_at"
                      id="created_at"
                      required
                      defaultValue={created_at}
                      readOnly={true}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="updated_at">Actualizado</Label>
                    <Input
                      type="text"
                      name="updated_at"
                      id="updated_at"
                      required
                      defaultValue={updated_at}
                      readOnly={true}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Link
                to={`/services/${id}/edit`}
                className="btn btn-primary align-right"
              >
                Editar Servicio
              </Link>
            </Form>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default Component;
