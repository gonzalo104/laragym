import React from 'react';
import serialize from 'form-serialize';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';

import getErrorMessage from 'utils/getErrorMessage';
import notify from 'utils/notify';
import StatusSelect from 'components/Form/Select/StatusSelect';

export default class extends React.Component {
  static defaultProps = {
    successMessage: 'Successfully submitted',
    name: undefined,
    amount: undefined,
    description: undefined,
    num_days: undefined,
    status: undefined,
    onSubmit: () => {},
  };

  state = {
    isSubmitting: false,
  };

  onSubmit = async event => {
    try {
      event.preventDefault();
      this.setState({isSubmitting: true});
      const form = event.target;
      const data = serialize(form, {hash: true});
      await this.props.onSubmit(data);
      this.setState({isSubmitting: false});
      notify({
        type: 'success',
        text: this.props.successMessage,
      });
    } catch (error) {
      notify({
        type: 'error',
        text: getErrorMessage(error),
      });
      this.setState({isSubmitting: false});
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <FormGroup>
          <Label for="Name">Nombre</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            required
            defaultValue={this.props.name}
            disabled={this.state.isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label for="num_days">Número de días</Label>
          <Input
            type="number"
            name="num_days"
            id="num_days"
            required
            defaultValue={this.props.num_days}
            disabled={this.state.isSubmitting}
          />
        </FormGroup>

        {this.props.status && (
          <FormGroup>
            <Label for="status">Estaatus</Label>
            <StatusSelect defaultValue={this.props.status} name="status" />
          </FormGroup>
        )}

        <FormGroup>
          <Label for="description">Descripción</Label>
          <Input
            type="textarea"
            rows={8}
            name="description"
            id="description"
            required
            defaultValue={this.props.description}
            disabled={this.state.isSubmitting}
          />
        </FormGroup>

        <Button
          color="primary"
          className="float-right"
          disabled={this.state.isSubmitting}
        >
          {this.state.isSubmitting
            ? 'Por Favor Espere...'
            : 'Enviar Formulario'}
        </Button>
      </Form>
    );
  }
}
