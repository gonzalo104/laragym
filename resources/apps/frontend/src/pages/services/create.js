import React from 'react';

import {Card, CardBody} from 'reactstrap';
import Form from './form';
import Breadcrumbs from 'components/Breadcrumbs';
import {createService} from 'requests/services';

class Component extends React.Component {
  state = {};

  get previous() {
    return [
      {
        to: '/services',
        label: 'Servicios',
      },
    ];
  }

  onSubmit = data => {
    return createService(data).then(() => {
      setTimeout(() => {
        this.props.history.replace('/services');
      }, 1000);
    });
  };

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs previous={this.previous} active="Crear Servicio" />
        <Card>
          <CardBody>
            <Form onSubmit={this.onSubmit} />
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default Component;
